<?php
/**
 * FractionQuest — backend.php
 * Simple API for saving and retrieving game scores.
 * Run via XAMPP (or any PHP server with a writable directory).
 *
 * Endpoints:
 *   POST ?action=save_score  — save a score entry (JSON body)
 *   GET  ?action=get_scores&mode=beginner  — retrieve top 10 scores
 *   GET  ?action=get_stats   — aggregate stats
 */

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// ============================================================
// CONFIGURATION
// ============================================================

/** Path to the JSON "database" file (kept simple, no MySQL required) */
define("DB_FILE", __DIR__ . "/scores.json");

/** Allowed game modes */
define("VALID_MODES", ["beginner", "intermediate", "challenge"]);

/** Max scores stored per mode */
define("MAX_SCORES_PER_MODE", 50);

// ============================================================
// HELPERS
// ============================================================

/**
 * Load scores from the JSON file.
 * Returns an associative array keyed by mode.
 */
function loadDb(): array {
    if (!file_exists(DB_FILE)) {
        return ["beginner" => [], "intermediate" => [], "challenge" => []];
    }
    $raw = file_get_contents(DB_FILE);
    $data = json_decode($raw, true);
    return is_array($data) ? $data : ["beginner" => [], "intermediate" => [], "challenge" => []];
}

/**
 * Persist the database back to disk.
 */
function saveDb(array $data): bool {
    return file_put_contents(DB_FILE, json_encode($data, JSON_PRETTY_PRINT)) !== false;
}

/**
 * Sanitize a string — strip tags, limit length.
 */
function sanitize(string $s, int $maxLen = 30): string {
    return substr(strip_tags(trim($s)), 0, $maxLen);
}

/**
 * Return a JSON error response and exit.
 */
function jsonError(string $msg, int $code = 400): never {
    http_response_code($code);
    echo json_encode(["success" => false, "error" => $msg]);
    exit;
}

// ============================================================
// ROUTING
// ============================================================

$action = $_GET["action"] ?? $_POST["action"] ?? "";

// Parse JSON body for POST requests
$body = [];
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $raw = file_get_contents("php://input");
    if ($raw) {
        $body = json_decode($raw, true) ?? [];
        // Merge so action can come from body too
        if (isset($body["action"])) $action = $body["action"];
    }
}

switch ($action) {

    // --------------------------------------------------------
    // SAVE SCORE
    // POST { action, name, score, mode, correct, streak }
    // --------------------------------------------------------
    case "save_score":
        $name    = sanitize($body["name"]    ?? "Anonymous");
        $score   = (int)   ($body["score"]   ?? 0);
        $mode    = sanitize($body["mode"]    ?? "beginner");
        $correct = (int)   ($body["correct"] ?? 0);
        $streak  = (int)   ($body["streak"]  ?? 0);

        if (!in_array($mode, VALID_MODES)) {
            jsonError("Invalid mode.");
        }
        if ($score < 0 || $score > 99999) {
            jsonError("Score out of range.");
        }

        $db = loadDb();

        // Build entry
        $entry = [
            "name"    => $name,
            "score"   => $score,
            "correct" => $correct,
            "streak"  => $streak,
            "mode"    => $mode,
            "date"    => date("c"),        // ISO 8601
        ];

        // Add and sort descending by score
        $db[$mode][] = $entry;
        usort($db[$mode], fn($a, $b) => $b["score"] <=> $a["score"]);

        // Trim to max
        $db[$mode] = array_slice($db[$mode], 0, MAX_SCORES_PER_MODE);

        if (!saveDb($db)) {
            jsonError("Could not save score. Check file permissions.", 500);
        }

        echo json_encode([
            "success" => true,
            "message" => "Score saved!",
            "rank"    => array_search($entry, $db[$mode]) + 1,
        ]);
        break;

    // --------------------------------------------------------
    // GET SCORES
    // GET ?action=get_scores&mode=intermediate&limit=10
    // --------------------------------------------------------
    case "get_scores":
        $mode  = sanitize($_GET["mode"]  ?? "intermediate");
        $limit = min((int)($_GET["limit"] ?? 10), 50);

        if (!in_array($mode, VALID_MODES)) {
            jsonError("Invalid mode.");
        }

        $db = loadDb();
        $scores = array_slice($db[$mode], 0, $limit);

        echo json_encode([
            "success" => true,
            "mode"    => $mode,
            "scores"  => $scores,
            "total"   => count($db[$mode]),
        ]);
        break;

    // --------------------------------------------------------
    // GET STATS (aggregate across all modes)
    // GET ?action=get_stats
    // --------------------------------------------------------
    case "get_stats":
        $db = loadDb();
        $stats = [];
        foreach (VALID_MODES as $m) {
            $scores = $db[$m];
            $stats[$m] = [
                "total_games"  => count($scores),
                "top_score"    => empty($scores) ? 0 : $scores[0]["score"],
                "avg_score"    => empty($scores) ? 0 : round(array_sum(array_column($scores, "score")) / count($scores)),
                "top_player"   => empty($scores) ? "" : $scores[0]["name"],
            ];
        }
        echo json_encode(["success" => true, "stats" => $stats]);
        break;

    // --------------------------------------------------------
    // CLEAR SCORES (for testing — disable in production!)
    // GET ?action=clear&mode=beginner&secret=devonly
    // --------------------------------------------------------
    case "clear":
        $secret = $_GET["secret"] ?? "";
        if ($secret !== "devonly") jsonError("Forbidden", 403);
        $mode = sanitize($_GET["mode"] ?? "");
        $db = loadDb();
        if (in_array($mode, VALID_MODES)) {
            $db[$mode] = [];
        } else {
            // Clear all
            foreach (VALID_MODES as $m) $db[$m] = [];
        }
        saveDb($db);
        echo json_encode(["success" => true, "message" => "Cleared."]);
        break;

    // --------------------------------------------------------
    // DEFAULT — health check
    // --------------------------------------------------------
    default:
        echo json_encode([
            "success" => true,
            "message" => "FractionQuest API is running 🍕",
            "version" => "1.0.0",
            "endpoints" => [
                "POST save_score" => "{ name, score, mode, correct, streak }",
                "GET  get_scores" => "?mode=beginner&limit=10",
                "GET  get_stats"  => "(no params)",
            ],
        ]);
        break;
}

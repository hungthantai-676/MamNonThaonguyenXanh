<?php
/**
 * Sync API for updating content from Replit
 * Secure webhook endpoint for automatic content updates
 */

header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../config/settings.php';

// Security check
$headers = getallheaders();
$auth_token = $headers['Authorization'] ?? $_POST['token'] ?? '';

if (empty($auth_token) || $auth_token !== getSetting('sync_settings', 'sync_token')) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Get request method and endpoint
$method = $_SERVER['REQUEST_METHOD'];
$endpoint = $_GET['endpoint'] ?? '';

// Parse JSON input
$input = json_decode(file_get_contents('php://input'), true);

switch ($endpoint) {
    case 'articles':
        handleArticles($method, $input);
        break;
    
    case 'programs':
        handlePrograms($method, $input);
        break;
    
    case 'activities':
        handleActivities($method, $input);
        break;
    
    case 'testimonials':
        handleTestimonials($method, $input);
        break;
    
    case 'content':
        handleSiteContent($method, $input);
        break;
    
    case 'full-sync':
        handleFullSync($input);
        break;
    
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        exit;
}

function handleArticles($method, $data) {
    switch ($method) {
        case 'GET':
            $articles = getRecords("SELECT * FROM articles ORDER BY created_at DESC");
            echo json_encode($articles);
            break;
        
        case 'POST':
            $sql = "INSERT INTO articles (title, excerpt, content, category, image_url) VALUES (?, ?, ?, ?, ?)";
            $id = insertRecord($sql, [
                $data['title'],
                $data['excerpt'],
                $data['content'],
                $data['category'],
                $data['imageUrl'] ?? null
            ]);
            echo json_encode(['success' => true, 'id' => $id]);
            break;
        
        case 'PUT':
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID required']);
                return;
            }
            
            $sql = "UPDATE articles SET title = ?, excerpt = ?, content = ?, category = ?, image_url = ? WHERE id = ?";
            $affected = updateRecord($sql, [
                $data['title'],
                $data['excerpt'],
                $data['content'],
                $data['category'],
                $data['imageUrl'] ?? null,
                $data['id']
            ]);
            echo json_encode(['success' => $affected > 0]);
            break;
        
        case 'DELETE':
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID required']);
                return;
            }
            
            $affected = updateRecord("DELETE FROM articles WHERE id = ?", [$data['id']]);
            echo json_encode(['success' => $affected > 0]);
            break;
    }
}

function handlePrograms($method, $data) {
    switch ($method) {
        case 'GET':
            $programs = getRecords("SELECT * FROM programs WHERE is_active = 1 ORDER BY display_order");
            echo json_encode($programs);
            break;
        
        case 'POST':
            $sql = "INSERT INTO programs (name, age_range, description, features, tuition, image_url) VALUES (?, ?, ?, ?, ?, ?)";
            $id = insertRecord($sql, [
                $data['name'],
                $data['ageRange'],
                $data['description'],
                $data['features'],
                $data['tuition'],
                $data['imageUrl'] ?? null
            ]);
            echo json_encode(['success' => true, 'id' => $id]);
            break;
        
        case 'PUT':
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID required']);
                return;
            }
            
            $sql = "UPDATE programs SET name = ?, age_range = ?, description = ?, features = ?, tuition = ?, image_url = ? WHERE id = ?";
            $affected = updateRecord($sql, [
                $data['name'],
                $data['ageRange'],
                $data['description'],
                $data['features'],
                $data['tuition'],
                $data['imageUrl'] ?? null,
                $data['id']
            ]);
            echo json_encode(['success' => $affected > 0]);
            break;
    }
}

function handleActivities($method, $data) {
    switch ($method) {
        case 'GET':
            $activities = getRecords("SELECT * FROM activities WHERE is_active = 1 ORDER BY date_time DESC");
            echo json_encode($activities);
            break;
        
        case 'POST':
            $sql = "INSERT INTO activities (name, description, date_time, location, frequency, image_url) VALUES (?, ?, ?, ?, ?, ?)";
            $id = insertRecord($sql, [
                $data['name'],
                $data['description'],
                $data['date'],
                $data['location'],
                $data['frequency'],
                $data['imageUrl'] ?? null
            ]);
            echo json_encode(['success' => true, 'id' => $id]);
            break;
        
        case 'PUT':
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID required']);
                return;
            }
            
            $sql = "UPDATE activities SET name = ?, description = ?, date_time = ?, location = ?, frequency = ?, image_url = ? WHERE id = ?";
            $affected = updateRecord($sql, [
                $data['name'],
                $data['description'],
                $data['date'],
                $data['location'],
                $data['frequency'],
                $data['imageUrl'] ?? null,
                $data['id']
            ]);
            echo json_encode(['success' => $affected > 0]);
            break;
    }
}

function handleTestimonials($method, $data) {
    switch ($method) {
        case 'GET':
            $testimonials = getRecords("SELECT * FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC");
            echo json_encode($testimonials);
            break;
        
        case 'POST':
            $sql = "INSERT INTO testimonials (name, role, content, rating, image_url) VALUES (?, ?, ?, ?, ?)";
            $id = insertRecord($sql, [
                $data['name'],
                $data['role'],
                $data['content'],
                $data['rating'] ?? 5,
                $data['imageUrl'] ?? null
            ]);
            echo json_encode(['success' => true, 'id' => $id]);
            break;
    }
}

function handleSiteContent($method, $data) {
    switch ($method) {
        case 'GET':
            $content = getRecords("SELECT * FROM site_content");
            echo json_encode($content);
            break;
        
        case 'POST':
            $sql = "INSERT INTO site_content (section, key_name, value, type) VALUES (?, ?, ?, ?) 
                    ON DUPLICATE KEY UPDATE value = VALUES(value), type = VALUES(type)";
            $affected = updateRecord($sql, [
                $data['section'],
                $data['key'],
                $data['value'],
                $data['type'] ?? 'text'
            ]);
            echo json_encode(['success' => $affected > 0]);
            break;
    }
}

function handleFullSync($data) {
    global $pdo;
    
    try {
        $pdo->beginTransaction();
        
        // Sync all content types
        if (isset($data['articles'])) {
            foreach ($data['articles'] as $article) {
                $sql = "INSERT INTO articles (id, title, excerpt, content, category, image_url) VALUES (?, ?, ?, ?, ?, ?) 
                        ON DUPLICATE KEY UPDATE title = VALUES(title), excerpt = VALUES(excerpt), 
                        content = VALUES(content), category = VALUES(category), image_url = VALUES(image_url)";
                executeQuery($sql, [
                    $article['id'],
                    $article['title'],
                    $article['excerpt'],
                    $article['content'],
                    $article['category'],
                    $article['imageUrl'] ?? null
                ]);
            }
        }
        
        if (isset($data['programs'])) {
            foreach ($data['programs'] as $program) {
                $sql = "INSERT INTO programs (id, name, age_range, description, features, tuition, image_url) VALUES (?, ?, ?, ?, ?, ?, ?) 
                        ON DUPLICATE KEY UPDATE name = VALUES(name), age_range = VALUES(age_range), 
                        description = VALUES(description), features = VALUES(features), tuition = VALUES(tuition), image_url = VALUES(image_url)";
                executeQuery($sql, [
                    $program['id'],
                    $program['name'],
                    $program['ageRange'],
                    $program['description'],
                    $program['features'],
                    $program['tuition'],
                    $program['imageUrl'] ?? null
                ]);
            }
        }
        
        if (isset($data['activities'])) {
            foreach ($data['activities'] as $activity) {
                $sql = "INSERT INTO activities (id, name, description, date_time, location, frequency, image_url) VALUES (?, ?, ?, ?, ?, ?, ?) 
                        ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), 
                        date_time = VALUES(date_time), location = VALUES(location), frequency = VALUES(frequency), image_url = VALUES(image_url)";
                executeQuery($sql, [
                    $activity['id'],
                    $activity['name'],
                    $activity['description'],
                    $activity['date'],
                    $activity['location'],
                    $activity['frequency'],
                    $activity['imageUrl'] ?? null
                ]);
            }
        }
        
        // Update site content
        if (isset($data['content'])) {
            foreach ($data['content'] as $section => $items) {
                foreach ($items as $key => $value) {
                    $sql = "INSERT INTO site_content (section, key_name, value) VALUES (?, ?, ?) 
                            ON DUPLICATE KEY UPDATE value = VALUES(value)";
                    executeQuery($sql, [$section, $key, $value]);
                }
            }
        }
        
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Full sync completed']);
        
    } catch (Exception $e) {
        $pdo->rollback();
        http_response_code(500);
        echo json_encode(['error' => 'Sync failed: ' . $e->getMessage()]);
    }
}

// Log sync activity
function logSync($endpoint, $method, $success) {
    $log_entry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'endpoint' => $endpoint,
        'method' => $method,
        'success' => $success,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];
    
    file_put_contents('../logs/sync.log', json_encode($log_entry) . "\n", FILE_APPEND | LOCK_EX);
}
?>
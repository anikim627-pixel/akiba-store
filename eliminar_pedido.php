<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");

try {
    require_once __DIR__ . "/conexion.php";
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "message" => "No se pudo conectar con la base de datos: " . $error->getMessage(),
    ]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "ok" => false,
        "message" => "Metodo no permitido. Usa POST.",
    ]);
    exit;
}

$id = (int) ($_POST["id"] ?? 0);

if ($id < 1) {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "message" => "ID de pedido no valido.",
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM pedidos WHERE id = :id");
    $stmt->execute([":id" => $id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode([
            "ok" => false,
            "message" => "No se encontro el pedido.",
        ]);
        exit;
    }

    echo json_encode([
        "ok" => true,
        "message" => "Pedido eliminado correctamente.",
    ]);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "message" => "No se pudo eliminar el pedido: " . $error->getMessage(),
    ]);
}

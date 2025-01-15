<?php

require __DIR__ . '/../../vendor/autoload.php';

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7Server\ServerRequestCreator;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Factory\AppFactory;

// Set up PSR-17 factory
$psr17Factory = new Psr17Factory();
AppFactory::setResponseFactory($psr17Factory);

// Create Slim App
$app = AppFactory::create();

// Set up ServerRequest creator
$serverRequestCreator = new ServerRequestCreator(
    $psr17Factory, // ServerRequestFactory
    $psr17Factory, // UriFactory
    $psr17Factory, // UploadedFileFactory
    $psr17Factory  // StreamFactory
);

$serverRequest = $serverRequestCreator->fromGlobals();

// Define routes
$app->get('/api/hello', function (ServerRequestInterface $request, ResponseInterface $response) {
    $response->getBody()->write("Hello, Slim!");
    return $response;
});

// Run the app
$app->run($serverRequest);

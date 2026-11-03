<?php

test('a raiz redireciona para o login quando não autenticado', function () {
    $this->get('/')->assertRedirect('/login');
});

test('a rota de saúde responde 200', function () {
    $this->get('/up')->assertStatus(200);
});

@extends('layouts.app')

@section('title', 'Login')

@section('content')
<div class="login-container">
    <div class="login-card">
        <h1>Entrar</h1>

        @if ($errors->any())
            <div class="alert alert-erro">
                {{ $errors->first() }}
            </div>
        @endif

        <form method="POST" action="{{ route('login.post') }}">
            @csrf

            <label for="email">E-mail</label>
            <input type="email" name="email" id="email" value="{{ old('email') }}" required autofocus>

            <label for="password">Senha</label>
            <input type="password" name="password" id="password" required>

            <label>
                <input type="checkbox" name="remember"> Lembrar-me
            </label>

            <button type="submit" class="btn btn-primario">Entrar</button>
        </form>
    </div>
</div>
@endsection
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class LoginController extends Controller
{
    public function showLoginForm(): View
    {
        return view('auth.login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // O guard `web` usa getAuthPassword() do Usuario → senha_hash.
        if (Auth::attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
            'ativo' => true,
        ], $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended(route('tela-inicial'));
        }

        return back()
            ->withInput($request->only('email'))
            ->withErrors(['email' => 'Credenciais inválidas ou usuário inativo.']);
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
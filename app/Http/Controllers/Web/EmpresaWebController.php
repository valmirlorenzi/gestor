<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Empresa;

class EmpresaWebController extends Controller
{
    public function index()
    {
        // Só existe uma empresa (ID = 1). A tela sempre edita.
        $empresa = Empresa::find(1);

        if (! $empresa) {
            abort(404, 'Empresa não encontrada. Rode o seeder: php artisan db:seed --class=EmpresaFilialSeeder');
        }

        return view('telas.empresa.index', compact('empresa'));
    }
}

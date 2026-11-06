@extends('layouts.app')

@section('title', 'Clientes')

@section('content')
    <div id="clientes-list-app">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h1>Clientes</h1>
            <a href="{{ route('faturista.clientes.create') }}" class="btn btn-primary">Novo cliente</a>
        </div>

        <div class="card">
            <h2>Lista</h2>
            <table class="data" id="tabela-clientes">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Documento</th>
                        <th>Tipo</th>
                        <th>Categoria</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Status</th>
                        <th style="width:180px;">Ações</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <p class="muted" id="clientes-vazio" style="display:none;">Nenhum cliente cadastrado.</p>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('assets/js/clientes-list.js') }}"></script>
@endpush
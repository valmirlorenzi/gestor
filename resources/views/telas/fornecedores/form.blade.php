@extends('layouts.app')

@section('title', isset($model) ? 'Editar fornecedor' : 'Novo fornecedor')

@section('content')
    <div id="fornecedores-form-app" data-id="{{ $model->id ?? '' }}">
        <h1>{{ isset($model) ? 'Editar fornecedor' : 'Novo fornecedor' }}</h1>

        <div class="card">
            <h2>Dados do fornecedor</h2>

            <div class="form-grid">
                <div class="form-row">
                    <label>Tipo</label>
                    <select id="tipo">
                        <option value="PJ">Pessoa Jurídica</option>
                        <option value="PF">Pessoa Física</option>
                    </select>
                </div>

                <div class="form-row">
                    <label>Documento (CPF/CNPJ)</label>
                    <input id="documento" maxlength="14" required>
                </div>

                <div class="form-row">
                    <label>Nome / Razão social</label>
                    <input id="nome" maxlength="200" required>
                </div>

                <div class="form-row">
                    <label>E-mail</label>
                    <input id="email" type="email" maxlength="200">
                </div>

                <div class="form-row">
                    <label>Telefone</label>
                    <input id="telefone" maxlength="20">
                </div>

                <div class="form-row">
                    <label>Categoria</label>
                    <input id="categoria" maxlength="50">
                </div>

                <div class="form-row">
                    <label>Status</label>
                    <select id="ativo">
                        <option value="1">Ativo</option>
                        <option value="0">Inativo</option>
                    </select>
                </div>
            </div>

            <h2 style="margin-top:16px;">Dados específicos</h2>

            <div id="bloco-pf" class="form-grid" style="display:none;">
                <div class="form-row">
                    <label>Data de nascimento</label>
                    <input id="data_nascimento" type="date">
                </div>
            </div>

            <div id="bloco-pj" class="form-grid">
                <div class="form-row">
                    <label>Nome fantasia</label>
                    <input id="nome_fantasia" maxlength="200">
                </div>

                <div class="form-row">
                    <label>ID Município</label>
                    <input id="id_municipio" type="number" min="1">
                </div>

                <div class="form-row">
                    <label>Categoria padrão</label>
                    <input id="categoria_padrao" maxlength="50">
                </div>

                <div class="form-row">
                    <label>Prazo padrão (dias)</label>
                    <input id="prazo_padrao_dias" type="number" min="0">
                </div>
            </div>
        </div>

        <div class="form-actions">
            <a href="{{ route('comprador.fornecedores.index') }}" class="btn btn-secondary">Cancelar</a>
            <button class="btn btn-primary" id="btn-salvar">Salvar</button>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('assets/js/fornecedores-form.js') }}"></script>
@endpush
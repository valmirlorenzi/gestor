@extends('layouts.app')

@section('title', 'Empresa')

@section('content')
<div id="empresa-app" data-id="{{ $empresa->id }}">
  <h1>Editar empresa</h1>
  <p class="subtitle" id="empresa-subtitle">Passo 1 de 2 — Dados da empresa</p>

  <div class="steps" id="empresa-steps">
    <div class="step active" data-step="1">1. Dados da empresa</div>
    <div class="step" data-step="2">2. Plano de contas</div>
  </div>

  {{-- Passo 1 --}}
  <div id="empresa-step-1">
    <div class="card">
      <h2>Regime fiscal *</h2>
      <div class="form-row">
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="regime" value="Simples" @checked($empresa->regime_fiscal === 'Simples')> Simples Nacional
        </label>
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="regime" value="Presumido" @checked($empresa->regime_fiscal === 'Presumido')> Lucro Presumido
        </label>
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="regime" value="Real" @checked($empresa->regime_fiscal === 'Real')> Lucro Real
        </label>
      </div>
    </div>

    <div class="card">
      <h2>Setor *</h2>
      <div class="form-row">
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="setor" value="Comercio" @checked($empresa->setor === 'Comercio')> Comércio
        </label>
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="setor" value="Servicos" @checked($empresa->setor === 'Servicos')> Serviços
        </label>
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="setor" value="Misto" @checked($empresa->setor === 'Misto')> Misto
        </label>
      </div>
    </div>

    <div class="card">
      <h2>Dados gerais</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>CNPJ *</label>
          <input type="text" id="empresa-cnpj" maxlength="14" placeholder="Somente números" value="{{ $empresa->cnpj }}">
        </div>
        <div class="form-row">
          <label>Razão social *</label>
          <input type="text" id="empresa-razao" maxlength="200" value="{{ $empresa->razao_social }}">
        </div>
        <div class="form-row">
          <label>Nome fantasia</label>
          <input type="text" id="empresa-fantasia" maxlength="200" value="{{ $empresa->nome_fantasia }}">
        </div>
        <div class="form-row">
          <label>Data de início *</label>
          <input type="date" id="empresa-data-inicio" value="{{ $empresa->data_inicio->format('Y-m-d') }}">
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-primary" id="empresa-proximo">Próximo →</button>
    </div>
  </div>

  {{-- Passo 2 --}}
  <div id="empresa-step-2" style="display:none;">
    <div class="card">
      <h2>Plano de contas sugerido</h2>
      <p class="muted" style="margin-bottom:12px;">O plano já vem com estrutura, sub-tipos e mapeamento referencial (ECD/ECF) embutido.</p>
      <label style="display:flex; align-items:flex-start; gap:8px; padding:12px; border:1px solid var(--cor-borda); border-radius:8px; font-weight:400;">
        <input type="radio" name="plano" value="padrao" checked>
        <span>
          <strong>Plano Gerencial Padrão — Comércio e Serviços</strong><br>
          <span class="muted">Ativo, Passivo, Custos, Despesas, Receitas, Resultado Financeiro.</span>
        </span>
      </label>
    </div>

    <div class="card">
      <h2>Resumo</h2>
      <table class="data">
        <tr><td><strong>Regime fiscal</strong></td><td id="resumo-regime">—</td></tr>
        <tr><td><strong>Setor</strong></td><td id="resumo-setor">—</td></tr>
        <tr><td><strong>CNPJ</strong></td><td id="resumo-cnpj">—</td></tr>
        <tr><td><strong>Razão social</strong></td><td id="resumo-razao">—</td></tr>
        <tr><td><strong>Data de início</strong></td><td id="resumo-data">—</td></tr>
        <tr><td><strong>Plano de contas</strong></td><td>Gerencial Padrão</td></tr>
      </table>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" id="empresa-voltar">← Voltar</button>
      <button class="btn btn-primary" id="empresa-concluir">Salvar alterações</button>
    </div>
  </div>

  {{-- Sucesso --}}
  <div id="empresa-sucesso" style="display:none;">
    <h1>Empresa atualizada com sucesso</h1>
    <p class="subtitle">As alterações foram salvas.</p>

    <div class="form-actions">
      <a href="{{ route('empresa.index') }}" class="btn btn-primary">Voltar para a empresa</a>
      <a href="{{ route('filial.index') }}" class="btn btn-secondary">Ir para filiais →</a>
    </div>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/empresa.js') }}"></script>
@endpush
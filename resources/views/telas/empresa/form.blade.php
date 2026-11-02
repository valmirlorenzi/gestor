@extends('layouts.app')

@section('title', isset($empresa) ? 'Editar Empresa' : 'Nova Empresa')

@section('content')
<div id="empresa-app" data-id="{{ $empresa->id ?? '' }}">
  <h1>{{ isset($empresa) ? 'Editar empresa' : 'Cadastrar empresa' }}</h1>
  <p class="subtitle" id="empresa-subtitle">{{ isset($empresa) ? 'Editar dados da empresa' : 'Passo 1 de 2 — Dados da empresa' }}</p>

  {{-- Passo 1 --}}
  <div id="empresa-step-1">
    <div class="card">
      <h2>Regime fiscal *</h2>
      <div class="form-row">
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="regime" value="Simples" {{ (isset($empresa) && $empresa->regime_fiscal === 'Simples') ? 'checked' : '' }}> Simples Nacional
        </label>
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="regime" value="Presumido" {{ (isset($empresa) && $empresa->regime_fiscal === 'Presumido') ? 'checked' : '' }}> Lucro Presumido
        </label>
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="regime" value="Real" {{ (isset($empresa) && $empresa->regime_fiscal === 'Real') ? 'checked' : '' }}> Lucro Real
        </label>
      </div>
    </div>

    <div class="card">
      <h2>Setor *</h2>
      <div class="form-row">
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="setor" value="Comercio" {{ (isset($empresa) && $empresa->setor === 'Comercio') ? 'checked' : '' }}> Comércio
        </label>
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="setor" value="Servicos" {{ (isset($empresa) && $empresa->setor === 'Servicos') ? 'checked' : '' }}> Serviços
        </label>
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="setor" value="Misto" {{ (isset($empresa) && $empresa->setor === 'Misto') ? 'checked' : '' }}> Misto
        </label>
      </div>
    </div>

    <div class="card">
      <h2>Dados gerais</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>CNPJ *</label>
          <input type="text" id="empresa-cnpj" maxlength="14" placeholder="Somente números" value="{{ $empresa->cnpj ?? '' }}">
        </div>
        <div class="form-row">
          <label>Razão social *</label>
          <input type="text" id="empresa-razao" maxlength="200" value="{{ $empresa->razao_social ?? '' }}">
        </div>
        <div class="form-row">
          <label>Nome fantasia</label>
          <input type="text" id="empresa-fantasia" maxlength="200" value="{{ $empresa->nome_fantasia ?? '' }}">
        </div>
        <div class="form-row">
          <label>Data de início *</label>
          <input type="date" id="empresa-data-inicio" value="{{ isset($empresa) ? $empresa->data_inicio->format('Y-m-d') : '' }}">
        </div>
      </div>
    </div>

    <div class="form-actions">
      <a href="{{ route('empresa.index') }}" class="btn btn-secondary">Cancelar</a>
      <button class="btn btn-primary" id="empresa-salvar">Salvar</button>
    </div>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/empresa.js') }}"></script>
@endpush
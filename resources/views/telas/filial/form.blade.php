@extends('layouts.app')

@section('title', isset($filial) ? 'Editar Filial' : 'Nova Filial')

@section('content')
<div id="filial-form-app" data-id="{{ $filial->id ?? '' }}">
  <h1>{{ isset($filial) ? 'Editar filial' : 'Cadastrar filial' }}</h1>

  <div class="card">
    <h2>Dados da filial</h2>
    <div class="form-grid">
      <div class="form-row">
        <label>CNPJ *</label>
        <input type="text" id="filial-cnpj" maxlength="14" placeholder="Somente números" value="{{ $filial->cnpj ?? '' }}">
      </div>
      <div class="form-row">
        <label>Razão social *</label>
        <input type="text" id="filial-razao" maxlength="200" value="{{ $filial->razao_social ?? '' }}">
      </div>
      <div class="form-row">
        <label>Nome fantasia</label>
        <input type="text" id="filial-fantasia" maxlength="200" value="{{ $filial->nome_fantasia ?? '' }}">
      </div>
      <div class="form-row">
        <label>Inscrição estadual</label>
        <input type="text" id="filial-ie" maxlength="20" value="{{ $filial->inscricao_estadual ?? '' }}">
      </div>
      <div class="form-row">
        <label>Inscrição municipal</label>
        <input type="text" id="filial-im" maxlength="20" value="{{ $filial->inscricao_municipal ?? '' }}">
      </div>
      <div class="form-row">
        <label>Endereço</label>
        <input type="text" id="filial-endereco" maxlength="300" value="{{ $filial->endereco ?? '' }}">
      </div>
      <div class="form-row">
        <label>Data de início *</label>
        <input type="date" id="filial-data-inicio" value="{{ isset($filial) ? $filial->data_inicio->format('Y-m-d') : '' }}">
      </div>
      <div class="form-row">
        <label>Ativo</label>
        <select id="filial-ativo">
          <option value="1" {{ (isset($filial) && $filial->ativo) ? 'selected' : '' }}>Sim</option>
          <option value="0" {{ (isset($filial) && !$filial->ativo) ? 'selected' : '' }}>Não</option>
        </select>
      </div>
    </div>
  </div>

  <div class="form-actions">
    <a href="{{ route('filial.index') }}" class="btn btn-secondary">Cancelar</a>
    <button class="btn btn-primary" id="filial-salvar">Salvar</button>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/filial-form.js') }}"></script>
@endpush
@extends('layouts.app')

@section('title', 'Ordem de Serviço Interna (OSI)')

@section('content')
<div id="osi-app">
  <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h1>Handoff — Fluxo entre Setores</h1>
    <span id="osi-badge" class="badge badge-ok">ativado</span>
  </div>
  <p class="subtitle">Ative ou desative o fluxo de documentos entre setores para esta empresa.</p>

  <div class="card">
    <h2>Configuração atual</h2>
    <div style="display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap;">
      <div>
        <p style="font-size:15px; font-weight:600; margin-bottom:6px;">
          Handoff está <span id="osi-status">...</span>
        </p>
        <p class="muted" style="font-size:13px;" id="osi-explicacao">...</p>
      </div>
      <button class="btn btn-primary" id="osi-toggle" type="button">Alternar</button>
    </div>
  </div>

  <div class="card" style="margin-top:20px;">
    <h2>O que muda ao ativar/desativar</h2>
    <table class="data data-regras">
      <thead>
        <tr>
          <th>Aspecto</th>
          <th>Handoff ATIVADO</th>
          <th>Handoff DESATIVADO</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Fluxo de documentos</strong></td>
          <td>Documentos geram ordens para o próximo setor</td>
          <td>Documentos avançam automaticamente de estado</td>
        </tr>
        <tr>
          <td><strong>Caixa de entrada</strong></td>
          <td>Ator vê as tarefas que recebeu</td>
          <td>Ator vê as tarefas da sua área (acumuladas)</td>
        </tr>
        <tr>
          <td><strong>Auditoria</strong></td>
          <td>Registra cada transição de estado (T8.7)</td>
          <td>Registra apenas a ação do ator</td>
        </tr>
        <tr>
          <td><strong>Indicação para</strong></td>
          <td>Empresas com múltiplos setores</td>
          <td>Empresas pequenas (uma pessoa acumula funções)</td>
        </tr>
      </tbody>
    </table>
    <p class="muted" style="margin-top:12px; font-size:12px;">
      ⚠️ A alteração <strong>não afeta</strong> documentos já processados. Vale apenas para novos documentos.
    </p>
  </div>

  <div class="card" style="margin-top:20px;">
    <h2>Histórico de alterações</h2>
    <table class="data">
      <thead>
        <tr>
          <th>Data</th>
          <th>Usuário</th>
          <th>Ação</th>
          <th>Justificativa</th>
        </tr>
      </thead>
      <tbody id="osi-historico"></tbody>
    </table>
    <p class="muted" id="osi-historico-vazio" style="display:none;">Nenhuma alteração registrada.</p>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/osi-form.js') }}"></script>
@endpush
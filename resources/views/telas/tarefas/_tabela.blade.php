@if ($tarefas->isEmpty())
  <p class="muted">Nenhuma tarefa.</p>
@else
  <table class="tabela-tarefas">
    <thead>
      <tr>
        <th>#</th>
        <th>Descrição</th>
        <th>Status</th>
        <th>Prioridade</th>
        <th>Criada em</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      @foreach ($tarefas as $t)
        <tr class="{{ $t->urgente ? 'urgente' : '' }}">
          <td>O{{ $t->id }}</td>
          <td>{{ $t->descricao_resumida ?? '—' }}</td>
          <td>{{ $t->status }}</td>
          <td>{{ $t->urgente ? '🔴 urgente' : ($t->prioridade ?? '—') }}</td>
          <td>{{ optional($t->data_criacao)->format('d/m/Y H:i') ?? '—' }}</td>
          <td><a href="#" class="link">abrir</a></td>
        </tr>
      @endforeach
    </tbody>
  </table>
@endif
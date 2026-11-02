<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ncms', function (Blueprint $table) {
            // O código agora aceita formatos como '01', '0101', '0101.2', '0101.21', '0101.21.00'
            $table->string('codigo', 10)->change();

            // Auto-relacionamento: cada nível aponta para o pai
            $table->foreignId('id_ncm_pai')
                ->nullable()
                ->after('codigo')
                ->constrained('ncms')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            // Indica se o nível pode ser usado em nota fiscal (só o de 8 dígitos)
            $table->boolean('aceita_lancamento')
                ->default(false)
                ->after('descricao');

            // Nível hierárquico: 1=capítulo, 2=posição, 3=subposição, 4=item, 5=subitem
            $table->tinyInteger('nivel')
                ->nullable()
                ->after('aceita_lancamento');

            $table->index('id_ncm_pai');
            $table->index('aceita_lancamento');
        });
    }

    public function down(): void
    {
        Schema::table('ncms', function (Blueprint $table) {
            $table->dropForeign(['id_ncm_pai']);
            $table->dropIndex(['id_ncm_pai']);
            $table->dropIndex(['aceita_lancamento']);
            $table->dropColumn(['id_ncm_pai', 'aceita_lancamento', 'nivel']);
            $table->char('codigo', 8)->change();
        });
    }
};
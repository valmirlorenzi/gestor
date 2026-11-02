<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cfops', function (Blueprint $table) {
            $table->text('descricao')->change();
        });
        Schema::table('ncms', function (Blueprint $table) {
            $table->text('descricao')->change();
        });
        Schema::table('cnaes', function (Blueprint $table) {
            $table->text('descricao')->change();
        });
        Schema::table('servicos_lc116', function (Blueprint $table) {
            $table->text('descricao')->change();
        });
    }

    public function down(): void
    {
        Schema::table('cfops', function (Blueprint $table) {
            $table->string('descricao', 200)->change();
        });
        Schema::table('ncms', function (Blueprint $table) {
            $table->string('descricao', 300)->change();
        });
        Schema::table('cnaes', function (Blueprint $table) {
            $table->string('descricao', 300)->change();
        });
        Schema::table('servicos_lc116', function (Blueprint $table) {
            $table->string('descricao', 300)->change();
        });
    }
};
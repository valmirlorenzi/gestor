<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cnaes', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 15)->unique();
            $table->string('descricao', 300);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cnaes');
    }
};

<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CuriosityResource\Pages\CreateCuriosity;
use App\Filament\Resources\CuriosityResource\Pages\EditCuriosity;
use App\Filament\Resources\CuriosityResource\Pages\ListCuriosities;
use App\Models\Curiosity;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CuriosityResource extends Resource
{
    protected static ?string $model = Curiosity::class;

    protected static ?string $label = 'Curiosidade';
    protected static ?string $pluralLabel = 'Curiosidades';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('song_id')
                ->relationship('song', 'title')
                ->label('Música')
                ->required()
                ->searchable()
                ->preload(),
            TextInput::make('title')
                ->label('Título')
                ->required()
                ->maxLength(255),
            Textarea::make('content')
                ->label('Conteúdo')
                ->required()
                ->columnSpanFull()
                ->rows(5),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Título')
                    ->searchable()
                    ->limit(30),
                TextColumn::make('song.title')
                    ->label('Música')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('song.artist.name')
                    ->label('Artista')
                    ->searchable(),
                TextColumn::make('created_at')
                    ->label('Criado em')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                \Filament\Actions\BulkActionGroup::make([
                    \Filament\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCuriosities::route('/'),
            'create' => CreateCuriosity::route('/create'),
            'edit' => EditCuriosity::route('/{record}/edit'),
        ];
    }
}

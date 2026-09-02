<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ArtistResource\Pages\CreateArtist;
use App\Filament\Resources\ArtistResource\Pages\EditArtist;
use App\Filament\Resources\ArtistResource\Pages\ListArtists;
use App\Filament\Resources\ArtistResource\RelationManagers\SongsRelationManager;
use App\Models\Artist;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ArtistResource extends Resource
{
    protected static ?string $model = Artist::class;
    
    protected static ?string $label = 'Artista';
    protected static ?string $pluralLabel = 'Artistas';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')
                ->label('Nome')
                ->required()
                ->maxLength(255),
            Textarea::make('bio')
                ->label('Biografia')
                ->columnSpanFull()
                ->rows(5),
            TextInput::make('image_url')
                ->label('URL da Imagem')
                ->url()
                ->placeholder('https://exemplo.com/imagem.jpg'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Nome')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('songs_count')
                    ->counts('songs')
                    ->label('Músicas')
                    ->sortable(),
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
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            SongsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListArtists::route('/'),
            'create' => CreateArtist::route('/create'),
            'edit' => EditArtist::route('/{record}/edit'),
        ];
    }
}
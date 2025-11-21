'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Favorite = {
  id?: number;
  name: string;
  category: string;
  note: string;
  created_at?: string;
};

export default function Home() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    const { data, error } = await supabase
      .from('Favorites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching data:', error);
    else setFavorites(data || []);
  }
  
  async function addFavorite() {
    if (!name || !category) return;

    const { error } = await supabase
      .from('Favorites')
      .insert([{ name, category, note }]);

    if (error) console.error('Error inserting data:', error);
    else {
      setName('');
      setCategory('');
      setNote('');
      fetchFavorites();
    }
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        My Favorites
      </h1>

      {/* Input Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex flex-col gap-4">
        <input
          className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <textarea
          className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
        <button
          onClick={addFavorite}
          className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Favorite
        </button>
      </div>

      {/* Favorites List */}
      <div className="flex flex-col gap-4">
        {favorites.length === 0 ? (
          <p className="text-gray-500 text-center">No favorites yet.</p>
        ) : (
          favorites.map((f) => (
            <div
              key={f.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-1">
                <h2 className="font-bold text-lg text-gray-800">{f.name}</h2>
                <span className="text-sm text-gray-500">
                  {f.created_at &&
                    new Date(f.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-600">
                <strong>Category:</strong> {f.category}
              </p>
              {f.note && <p className="text-gray-600 mt-1">{f.note}</p>}
            </div>
          ))
        )}
      </div>
    </main>
  );
}

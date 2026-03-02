// supabaseClient.js - Initializes Supabase connection

const SUPABASE_URL = 'https://llbowmmqyleosqxvjvvx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsYm93bW1xeWxlb3NxeHZqdnZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNTczNTksImV4cCI6MjA4NzkzMzM1OX0.ZfAo7h6-i-t9gdyUo7MR3Oz8JZe5GnQ61mrFNyGYIE4';

// Initialize the Supabase client
// The UMD bundle exposes supabase globally with a createClient method
if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
    console.error('Supabase SDK not loaded! Make sure the CDN script is included before this file.');
} else {
    const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized.');
    window.supabaseClient = _supabase;
}

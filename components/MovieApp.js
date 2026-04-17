'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import SearchBar from '@/components/SearchBar';
import MovieGrid from '@/components/MovieGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export default function MovieApp() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const debounceRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  // Fetch movies
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!API_KEY) {
        throw new Error(
          'TMDB API key is not configured. Please add your API key to the .env.local file as NEXT_PUBLIC_TMDB_API_KEY.',
        );
      }

      let url;
      if (debouncedQuery.trim()) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          debouncedQuery.trim(),
        )}&page=${page}&include_adult=false`;
      } else {
        url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch movies (${response.status}). Please try again later.`,
        );
      }

      const data = await response.json();

      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 500)); // TMDB caps at 500
      setTotalResults(data.total_results || 0);
    } catch (err) {
      setError(
        err.message || 'An unexpected error occurred. Please try again.',
      );
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    fetchMovies();
  };

  // Generate pagination numbers
  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className='flex-1 flex flex-col'>
      {/* Hero Header */}
      <header className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-linear-to-br from-primary/20 via-background to-primary-dark/10' />
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-primary/5 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8'>
          <div className='text-center mb-8'>
            <div className='inline-flex items-center gap-2 mb-4'>
              <svg
                className='w-10 h-10 text-primary-light'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z' />
              </svg>
              <h1 className='text-4xl sm:text-5xl font-bold bg-linear-to-r from-primary-light via-white to-primary bg-clip-text text-transparent'>
                CineVault
              </h1>
            </div>
            <p className='text-muted text-lg max-w-2xl mx-auto'>
              Discover trending movies, explore ratings, and search through
              thousands of films from TMDB.
            </p>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
          />

          {/* Results summary */}
          {!loading && !error && (
            <div className='text-center mt-4'>
              <p className='text-muted text-sm'>
                {debouncedQuery.trim() ? (
                  <>
                    Found{' '}
                    <span className='text-primary-light font-semibold'>
                      {totalResults.toLocaleString()}
                    </span>{' '}
                    results for &ldquo;
                    <span className='text-foreground font-medium'>
                      {debouncedQuery}
                    </span>
                    &rdquo;
                  </>
                ) : (
                  <>
                    Showing{' '}
                    <span className='text-primary-light font-semibold'>
                      Popular Movies
                    </span>{' '}
                    &mdash; Page {page} of {totalPages.toLocaleString()}
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {loading && <LoadingSpinner />}

        {error && <ErrorMessage message={error} onRetry={handleRetry} />}

        {!loading && !error && movies.length === 0 && (
          <div className='text-center py-20 fade-in-up'>
            <svg
              className='w-20 h-20 text-surface-lighter mx-auto mb-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z'
              />
            </svg>
            <h2 className='text-2xl font-semibold text-foreground mb-2'>
              No Movies Found
            </h2>
            <p className='text-muted max-w-md mx-auto'>
              We couldn&apos;t find any movies matching &ldquo;
              {debouncedQuery}&rdquo;. Try adjusting your search terms.
            </p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <>
            <MovieGrid movies={movies} />

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label='Pagination'
                className='flex justify-center items-center gap-2 mt-12 mb-4 flex-wrap'
              >
                <button
                  id='pagination-prev'
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className='px-4 py-2 rounded-lg bg-surface text-foreground border border-border 
                    hover:bg-surface-light hover:border-primary/50 transition-all duration-200
                    disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:border-border
                    text-sm font-medium'
                >
                  ← Prev
                </button>

                {getPaginationRange().map((item, index) =>
                  item === '...' ? (
                    <span
                      key={`dots-${index}`}
                      className='px-2 py-2 text-muted text-sm'
                    >
                      •••
                    </span>
                  ) : (
                    <button
                      key={item}
                      id={`pagination-page-${item}`}
                      onClick={() => handlePageChange(item)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                          page === item
                            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110'
                            : 'bg-surface text-foreground border border-border hover:bg-surface-light hover:border-primary/50'
                        }`}
                    >
                      {item}
                    </button>
                  ),
                )}

                <button
                  id='pagination-next'
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className='px-4 py-2 rounded-lg bg-surface text-foreground border border-border 
                    hover:bg-surface-light hover:border-primary/50 transition-all duration-200
                    disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:border-border
                    text-sm font-medium'
                >
                  Next →
                </button>
              </nav>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className='border-t border-border bg-surface/30 backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div className='flex items-center gap-2 text-muted text-sm'>
              <svg
                className='w-5 h-5 text-primary-light'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z' />
              </svg>
              <span>CineVault</span>
              <span className='text-border'>•</span>
              <span>Built with Next.js & TMDB</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export default function MovieCard({ movie, index }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    title,
    poster_path,
    vote_average,
    vote_count,
    release_date,
    overview,
  } = movie;

  const year = release_date ? new Date(release_date).getFullYear() : 'N/A';
  const rating = vote_average ? vote_average.toFixed(1) : 'N/A';
  const posterUrl = poster_path
    ? `${TMDB_IMAGE_BASE}/w500${poster_path}`
    : null;

  // Color for rating badge
  const getRatingColor = () => {
    if (!vote_average) return 'bg-surface-lighter text-muted';
    if (vote_average >= 8)
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (vote_average >= 6)
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <article
      id={`movie-card-${movie.id}`}
      className='group relative bg-surface rounded-2xl overflow-hidden border border-border/50
        hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10
        transition-all duration-300 ease-out hover:-translate-y-1 fade-in-up'
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Poster Image */}
      <div className='relative aspect-2/3 overflow-hidden bg-surface-light'>
        {posterUrl && !imageError ? (
          <>
            {/* Shimmer placeholder while loading */}
            {!imageLoaded && <div className='absolute inset-0 shimmer' />}
            <Image
              src={posterUrl}
              alt={`${title} movie poster`}
              fill
              sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw'
              className={`object-cover transition-all duration-500 group-hover:scale-105
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className='absolute inset-0 flex flex-col items-center justify-center bg-surface-light text-muted/40'>
            <svg
              className='w-16 h-16 mb-2'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z' />
            </svg>
            <span className='text-sm'>No Poster</span>
          </div>
        )}

        {/* Rating Badge */}
        <div
          className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full
            border backdrop-blur-md text-sm font-bold ${getRatingColor()}`}
        >
          <svg
            className='w-3.5 h-3.5 star-glow'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
          {rating}
        </div>

        {/* Hover Overlay with Overview */}
        <div
          className='absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity duration-300
            flex flex-col justify-end p-4'
        >
          <p className='text-white/90 text-sm leading-relaxed line-clamp-5'>
            {overview || 'No description available for this movie.'}
          </p>
        </div>
      </div>

      {/* Card Info */}
      <div className='p-4'>
        <h2
          className='text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary-light
            transition-colors duration-200'
          title={title}
        >
          {title}
        </h2>
        <div className='flex items-center justify-between mt-2'>
          <span className='text-sm text-muted'>{year}</span>
          <span className='text-xs text-muted/60'>
            {vote_count?.toLocaleString() || 0} votes
          </span>
        </div>
      </div>
    </article>
  );
}

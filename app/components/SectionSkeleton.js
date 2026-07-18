import React from 'react';

export function SectionSkeleton({ title = "Loading recommendations..." }) {
  return (
    <section className="border-t border-[#bcc4cf] bg-[#f4f4f4] py-10">
      <div className="mx-auto max-w-[1260px] px-4 lg:px-6">
        <div className="mb-5 h-8 w-56 animate-pulse rounded-full bg-[#e2e8f0]" />
        <div className="flex gap-4 overflow-hidden pb-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <article
              key={`${title}-skeleton-${index}`}
              className="min-w-[280px] max-w-[280px] overflow-hidden rounded-[14px] border border-[#e2e8f0] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]"
            >
              <div className="h-[190px] w-full animate-pulse bg-[#dbe3ed]" />
              <div className="flex min-h-[170px] flex-col gap-4 bg-[#ffe1a3] p-4">
                <div className="h-6 w-4/5 animate-pulse rounded-full bg-[#f4d77f]" />
                <div className="h-4 w-full animate-pulse rounded-full bg-[#f4d77f]" />
                <div className="h-4 w-5/6 animate-pulse rounded-full bg-[#f4d77f]" />
                <div className="mt-auto h-10 w-full animate-pulse rounded-[7px] bg-[#ffd16c]" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

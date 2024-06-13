import React from 'react';

import type { InternalDocSearchHit, StoredDocSearchHit } from './types';

interface HitProps {
  hit: InternalDocSearchHit | StoredDocSearchHit;
  children: React.ReactNode;
}

// export function Hit({ hit, children }: HitProps) {
//   const handleLinkClick = () => {
//     window.location.reload();
//   };
//   return <a href={hit.url} onClick={handleLinkClick}>{children}</a>;
// }


export function Hit({ hit, children }: HitProps) {
  const handleLinkClick = () => {
    // Redirect to the URL specified in the hit object
    window.location.href = hit.url;
  };

  return <div className="replace-a-tag" onClick={handleLinkClick}>{children}</div>;
}


// export function Hit({ hit, children }: HitProps) {
//   return <a href={hit.url}>{children}</a>;
// }
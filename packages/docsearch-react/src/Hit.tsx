import React from 'react';

import type { InternalDocSearchHit, StoredDocSearchHit } from './types';

interface HitProps {
  hit: InternalDocSearchHit | StoredDocSearchHit;
  children: React.ReactNode;
}

// export function Hit({ hit, children }: HitProps) {
//   const handleLinkClick = () => {
//     // Redirect to the URL specified in the hit object
//     window.location.href = hit.url;
//   };

//   return (
//     <div className="replace-a-tag" onClick={handleLinkClick}>
//       {children}
//     </div>
//   );
// }

// function trimUrl(hit: InternalDocSearchHit | StoredDocSearchHit) {
//   const url = hit.url;
//   if (hit.type === 'lvl1' || hit.type === 'lvl0') {
//     const urlParts = url.split('#');
//     return urlParts[0];
//   }
//   return url;
// }
function trimUrl(hit: InternalDocSearchHit | StoredDocSearchHit) {
  let url = hit.url;

  if (hit.type === 'lvl1' || hit.type === 'lvl0') {
    // Remove fragment (#) if present
    url = url.split('#')[0];

    // For lvl0, remove the last path segment
    if (hit.type === 'lvl0') {
      url = url.substring(0, url.lastIndexOf('/')) || url;
    }
  }

  return url;
}

export function Hit({ hit, children }: HitProps) {
  return (
    <a className="replace-a-tag" href={trimUrl(hit)}>
      {children}
    </a>
  );
}

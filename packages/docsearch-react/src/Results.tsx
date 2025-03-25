import type {
  AutocompleteApi,
  AutocompleteState,
  BaseItem,
} from '@algolia/autocomplete-core';
import React from 'react';

import type { DocSearchProps } from './DocSearch';
import { Snippet } from './Snippet';
import type { InternalDocSearchHit, StoredDocSearchHit } from './types';

interface ResultsProps<TItem extends BaseItem>
  extends AutocompleteApi<
    TItem,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  title: string;
  collection: AutocompleteState<TItem>['collections'][0];
  renderIcon: (props: { item: TItem; index: number }) => React.ReactNode;
  renderAction: (props: {
    item: TItem;
    runDeleteTransition: (cb: () => void) => void;
    runFavoriteTransition: (cb: () => void) => void;
  }) => React.ReactNode;
  onItemClick: (item: TItem) => void;
  hitComponent: DocSearchProps['hitComponent'];
}

export const breadcrumbNameMapper = {
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
  react: 'React',
  angular: 'Angular',
  vue: 'Vue',
  svelte: 'Svelte',
  flutter: 'Flutter',
  'react-native': 'React Native',
  cordova: 'Cordova',
  capacitor: 'Capacitor',
  'hyper-checkout': 'HyperCheckout',
  'hypercheckout-global': 'HyperCheckout',
  dotp: 'Native OTP',
  'api-reference': 'API Reference',
  resources: 'Resources',
  faq: 'FAQ',
  faqs: 'FAQs',
  'ec-headless': 'Express Checkout SDK',
  payout: 'Juspay Payout',
  'payment-links': 'Payment Links',
  'ec-api': 'ExpressCheckout API',
  'upi-plugin-sdk': 'HyperUPI',
  'upi-tpap-sdk': 'UPI TPAP SDK',
  jusbiz: 'JusBiz',
  'express-checkout-sdk-brazil': 'Express Checkout SDK',
  'api-reference-brazil': 'API Reference',
  payv3: 'PayV3',
  'hyper-credit': 'HyperCredit',
  'express-checkout-sdk-global': 'Express Checkout SDK',
  'ec-api-global': 'ExpressCheckout API',
  'payout-sea': 'Payout',
  'payout-brazil': 'Payout',
  'resources-global': 'Resources',
  'pix-payment-flows-br': 'Pix Payment Flows',
  'offer-engine-sea': 'Offer Engine',
  'hyper-checkout-sea': 'HyperCheckout',
};

export function getBreadcrumbName(path: string): string {
  if (breadcrumbNameMapper[path]) return breadcrumbNameMapper[path];

  const cleanPath = path.replace(/^\/|\/$/g, '');
  const decodedPath = decodeHTMLEntities(cleanPath);

  return decodedPath
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function decodeHTMLEntities(text?: string): string {
  if (!text) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export function splitTitle(title?: string) {
  let splitArray = title;
  if (title) {
    splitArray = title.split('___')[0];
  }
  return splitArray;
}

export function Results<TItem extends StoredDocSearchHit>(
  props: ResultsProps<TItem>
) {
  if (!props.collection || props.collection.items.length === 0) {
    return null;
  }
  let sourceLink = '';
  let sourceLinkPaths: string[] = [];
  if (props?.collection?.items?.length > 0) {
    sourceLink = props.collection.items[0].url;
    const pathArray = new URL(sourceLink).pathname.split('/').filter(Boolean);
    sourceLinkPaths = pathArray.slice(-4);
  }

  return (
    <section className="DocSearch-Hits">
      <div className="Hit-Header">
        <div className="DocSearch-Hit-source">
          {decodeHTMLEntities(splitTitle(props.title))}
        </div>

        {sourceLink &&
        sourceLinkPaths.length == 4 &&
        props.title != 'Recent' ? (
          <div className="DocSearch-breadcrumb-source ">{`${getBreadcrumbName(
            sourceLinkPaths[0]
          )} > ${getBreadcrumbName(sourceLinkPaths[1])}`}</div>
        ) : (
          ``
        )}
      </div>

      <ul {...props.getListProps()}>
        {props.collection.items.every((item) => item.type === 'lvl0') ? (
          <Result
            key={[
              decodeHTMLEntities(splitTitle(props.title)),
              props.collection.items[0].objectID,
            ].join(':')}
            item={props.collection.items[0]}
            index={0}
            {...props}
          />
        ) : (
          ``
        )}
        {props.collection.items.map((item, index) => {
          return (
            item.type !== 'lvl0' && (
              <Result
                key={[props.title, item.objectID].join(':')}
                item={item}
                index={index}
                {...props}
              />
            )
          );
        })}
      </ul>
    </section>
  );
}

interface ResultProps<TItem extends BaseItem> extends ResultsProps<TItem> {
  item: TItem;
  index: number;
}

function Result<TItem extends StoredDocSearchHit>({
  item,
  index,
  renderIcon,
  renderAction,
  getItemProps,
  onItemClick,
  collection,
  hitComponent,
}: ResultProps<TItem>) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isFavoriting, setIsFavoriting] = React.useState(false);
  const action = React.useRef<(() => void) | null>(null);
  const Hit = hitComponent!;

  function runDeleteTransition(cb: () => void) {
    setIsDeleting(true);
    action.current = cb;
  }

  function runFavoriteTransition(cb: () => void) {
    setIsFavoriting(true);
    action.current = cb;
  }

  return (
    <li
      className={[
        'DocSearch-Hit',
        (item as unknown as InternalDocSearchHit).__docsearch_parent &&
          'DocSearch-Hit--Child',
        isDeleting && 'DocSearch-Hit--deleting',
        isFavoriting && 'DocSearch-Hit--favoriting',
      ]
        .filter(Boolean)
        .join(' ')}
      onTransitionEnd={() => {
        if (action.current) {
          action.current();
        }
      }}
      {...getItemProps({
        item,
        source: collection.source,
        onClick() {
          onItemClick(item);
        },
      })}
    >
      <Hit hit={item}>
        <div className="DocSearch-Hit-Container">
          {renderIcon({ item, index })}

          {item[`hierarchy.${item.type}`] && item.type === 'lvl0' && (
            <div className="DocSearch-Hit-content-wrapper">
              {/* <Snippet
                className="DocSearch-Hit-title"
                hit={item}
                attribute="hierarchy.lvl0"
              /> */}
              <span className="DocSearch-Hit-title">
                {decodeHTMLEntities(splitTitle(item[`hierarchy.lvl0`]))}
              </span>
            </div>
          )}

          {item[`hierarchy.${item.type}`] && item.type === 'lvl1' && (
            <div className="DocSearch-Hit-content-wrapper">
              <Snippet
                className="DocSearch-Hit-title"
                hit={item}
                attribute="hierarchy.lvl1"
              />
              {item.content && (
                <Snippet
                  className="DocSearch-Hit-path"
                  hit={item}
                  attribute="content"
                />
              )}
            </div>
          )}

          {item[`hierarchy.${item.type}`] &&
            (item.type === 'lvl2' ||
              item.type === 'lvl3' ||
              item.type === 'lvl4' ||
              item.type === 'lvl5' ||
              item.type === 'lvl6') && (
              <div className="DocSearch-Hit-content-wrapper">
                <Snippet
                  className="DocSearch-Hit-title"
                  hit={item}
                  attribute={`hierarchy.${item.type}`}
                />
                <Snippet
                  className="DocSearch-Hit-path"
                  hit={item}
                  attribute="hierarchy.lvl1"
                />
              </div>
            )}

          {item.type === 'content' && (
            <div className="DocSearch-Hit-content-wrapper">
              <Snippet
                className="DocSearch-Hit-title"
                hit={item}
                attribute="content"
              />
              <Snippet
                className="DocSearch-Hit-path"
                hit={item}
                attribute="hierarchy.lvl1"
              />
            </div>
          )}

          {renderAction({ item, runDeleteTransition, runFavoriteTransition })}
        </div>
      </Hit>
    </li>
  );
}

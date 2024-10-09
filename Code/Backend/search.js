import { liteClient as algoliasearch } from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import { searchBox, hits, configure } from 'instantsearch.js/es/widgets';
import { getPropertyByPath } from 'instantsearch.js/es/lib/utils';

const searchClient = algoliasearch('3SBZ9CQBIF', 'd2917a5826f5cb3297164eca75eca440');

const search = instantsearch({
  indexName: 'liftascend-default-rtdb-export',
  searchClient,
});

search.addWidgets([
  searchBox({
    container: '#searchbox',
  }),
  configure({
    hitsPerPage: 5,
  }),
  hits({
    container: '#hits',
    templates: {
      item: (hit, { html, components }) => html`
        <div>
          <div class="hit-full-name">
            ${components.Highlight({ hit, attribute: 'full_name' })}
          </div>
          <div class="hit-email">
            ${components.Highlight({ hit, attribute: 'email' })}
          </div>
          <div class="hit-total">
            <span>${getPropertyByPath(hit, 'liftData.0.total')}</span>
          </div>
        </div>
      `,
    },
  }),
]);

search.start();


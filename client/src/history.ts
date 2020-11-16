import { createBrowserHistory, Location } from 'history';
import { parse } from 'query-string';

export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL,
});

function parseSearch(location: Location) {
  location.query = parse(location.search);
}

history.listen(parseSearch);
parseSearch(history.location);

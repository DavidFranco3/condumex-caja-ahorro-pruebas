import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { map } from "lodash"
import LayoutPrincipal from "../layout/LayoutPrincipal";
import configRouting from './configRouting';

const Routing = ({ setRefreshCheckLogin }) => (
    <Router>
        <Switch>
            {map(configRouting, (route, index) => (
                <Route key={index} path={route.path} exact={route.exact} >
                    <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                        <route.page setRefreshCheckLogin={setRefreshCheckLogin} />
                    </LayoutPrincipal>
                </Route>
            ))}
        </Switch>
    </Router>
)

export default Routing;

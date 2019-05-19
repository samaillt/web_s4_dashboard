import { h } from 'hyperapp';
import { Link } from "@hyperapp/router"

export default () => (
	<header>
		<ul class="menu">
			<li>
				<Link to="/">Home</Link>
			</li>
			<li>
				<Link to="/profile">My channel</Link>
			</li>
		</ul>
	</header>
);

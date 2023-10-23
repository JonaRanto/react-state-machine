import React from "react";
import { useMachine } from "@xstate/react";
import bookingMachine from "../Machines/bookingMachine";

const BaseLayout = () => {
	const [state, send] = useMachine(bookingMachine);

	console.log("Nuestra máquina: ", state);
	console.log("matches true: ", state.matches("initial"));
	console.log("matches false: ", state.matches("tickets"));
	console.log("can: ", state.can("FINISH"));
	return (
		<div className="BaseLayout">
			<Nav />
			<StepsLayout />
		</div>
	);
};

export default BaseLayout;

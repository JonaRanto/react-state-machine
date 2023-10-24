import { assign, createMachine } from "xstate";
import { fetchCountries } from "../Utils/api";

const fillCountries = {
	initial: "loading",
	states: {
		loading: {
			invoke: {
				id: "getCountries",
				src: () => fetchCountries,
				onDone: {
					target: "success",
					actions: assign({
						countries: (context, event) => event.data,
					}),
				},
				onError: {
					target: "failure",
					actions: assign({
						error: "Fallo el request",
					}),
				},
			},
		},
		success: {},
		failure: {
			on: {
				RETRY: { target: "loading" },
			},
		},
	},
};

const bookingMachine = createMachine(
	{
		predictableActionArguments: true,
		id: "buy plane tickets",
		initial: "initial",
		context: {
			passengers: [],
			selectedCountry: "",
			countries: [],
			error: "",
		},
		states: {
			initial: {
				on: {
					START: {
						target: "search",
					},
				},
			},
			search: {
				on: {
					CONTINUE: {
						target: "passengers",
						actions: assign({
							selectedCountry: (context, event) => event.selectedCountry,
						}),
					},
					CANCEL: {
						target: "initial",
						actions: "cleanContext",
					},
				},
				...fillCountries,
			},
			tickets: {
				after: {
					5000: {
						target: "initial",
						actions: "cleanContext",
					},
				},
				on: {
					FINISH: {
						target: "initial",
						actions: "cleanContext",
					},
				},
			},
			passengers: {
				on: {
					DONE: {
						target: "tickets",
						cond: "moreThanOnePassenger",
					},
					CANCEL: {
						target: "initial",
						actions: "cleanContext",
					},
					ADD: {
						target: "passengers",
						actions: assign((context, event) =>
							context.passengers.push(event.newPasseneger)
						),
					},
				},
			},
		},
	},
	{
		actions: {
			cleanContext: assign((context) => {
				context.passengers = [];
				context.selectedCountry = "";
			}),
		},
		guards: {
			moreThanOnePassenger: (context) => {
				return context.passengers.length > 0;
			},
		},
	}
);

export default bookingMachine;

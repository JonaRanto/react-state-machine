import { assign, createMachine } from "xstate";

const bookingMachine = createMachine(
	{
		predictableActionArguments: true,
		id: "buy plane tickets",
		initial: "initial",
		context: {
			passengers: [],
			selectedCountry: "",
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
						actions: assign({
							passengers: [],
							selectedCountry: "",
						}),
					},
				},
			},
			tickets: {
				on: {
					FINISH: "initial",
				},
			},
			passengers: {
				on: {
					DONE: "tickets",
					CANCEL: {
						target: "initial",
						actions: assign({
							passengers: [],
							selectedCountry: "",
						}),
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
		actions: {},
	}
);

export default bookingMachine;

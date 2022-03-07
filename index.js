// Create closure for global state.
function createState() {
	let state = {};
	const setState = (newState) => {
		state = newState;
	};
	const getState = () => state;

	return { setState, getState };
}

// Execute when document has loaded.
$(document).ready(function () {
	const app = $("#app");
	app.removeClass("hidden");

	const tableData = createState();

	const updateTable = () => {
		const tHead = $("#stats > thead");
		const tBody = $("#stats > tbody");
		const data = tableData.getState();

		// Update name and year from data
		if (tHead.children().length > 1) {
			tHead.children()[0].remove();
		}
		tHead.prepend(`<tr><th>${data.name} (${data.year})</th></tr>`);

		// Update match data
		tBody.empty();
		tBody.append(
			data.match.reduce((acc, match, i) => {
				let output = "";
				match.player.forEach((player, j) => {
					output += `<tr>
					<td>${j === 0 ? i + 1 : ""}</td>
					<td>${match.round}</td>
					<td>${
						player.outcome === "won"
							? "<b>" + player.name + "</b>"
							: player.name
					}</td>
					${player.set.map((set) => "<td>" + set + "</td>")}
				</tr>`;
				});

				return acc + output;
			}, "")
		);
	};

	$.get("wimbledon-men.json", {}, (data) => {
		tableData.setState(data);
		updateTable();
	});
});

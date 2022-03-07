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
	const searchForm = $("#search-form");

	searchForm[0].reset(); // Reset form
	app.removeClass("hidden");

	const tableData = createState();

	const updateTable = () => {
		const data = tableData.getState();
		const stats = $("#stats");
		stats.addClass("hidden");

		// Update name and year from data
		stats.find("#data-title").text(`${data.name} (${data.year})`);

		// Update match data
		const tBody = stats.find("tbody");

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

		$("#stats").removeClass("hidden");
	};

	function resetFilters() {
		console.log("Filters reset");
	}

	searchForm.find('input[name="filters"]').click((e) => {
		if (!e.target.checked) {
			resetFilters();
		}
	});

	searchForm.submit((e) => {
		e.preventDefault();

		const filters = $(this).find('input[name="filters"]')[0].checked;

		$.get(
			$(this).find('select[name="category"] option:selected').val(),
			{},
			(data) => {
				tableData.setState(data);
				updateTable();
			}
		);
	});
});

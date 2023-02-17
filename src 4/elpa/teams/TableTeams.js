/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import DataTable from "elpa/teams/TeamsDataTable";
import DefaultCell from "elpa/members/DataTable/DefaultCell";
import TableTeamLogoCell from "elpa/teams/TableTeamLogoCell";
import TableTeamEditCell from "elpa/teams/TableTeamEditCell";
import TableCellLink from "./TableCellLink";

function TableTeams({ filteredTeams, deleteTheTeam }) {
  const TableTeamsColumn = [
    {
      Header: "Team Logo",
      accessor: "teamLogo",
      Cell: ({ value }) => <TableTeamLogoCell logoSource={value} />,
    },
    {
      Header: "Team Name",
      accessor: "teamNameLink",
      Cell: ({ value: [name, id] }) => <TableCellLink teamName={name} teamId={id} />,
      // Cell: ({value})=><DefaultCell value={value} />,
    },
    {
      Header: "Region",
      accessor: "region",
      Cell: ({ value }) => <DefaultCell value={value} />,
    },
    {
      Header: "Country",
      accessor: "country",
      Cell: ({ value }) => <DefaultCell value={value} />,
    },
    {
      Header: "League",
      accessor: "league",
      Cell: ({ value }) => <DefaultCell value={value} />,
    },
    {
      Header: "City",
      accessor: "city",
      Cell: ({ value }) => <DefaultCell value={value} />,
    },
    {
      Header: "",
      accessor: "id",
      align: "right",
      sortable: false,
      Cell: ({ value }) => <TableTeamEditCell teamId={value} deleteTheTeam={deleteTheTeam} />,
    },
  ];

  const dataTeams = {
    columns: TableTeamsColumn,
    rows: filteredTeams !== undefined ? filteredTeams : [],
  };

  return (
    <div>
      <DataTable table={dataTeams} entriesPerPage={false} />
    </div>
  );
}
export default TableTeams;

import React, { useEffect } from "react";
// import '../styles/home.css'
import "../../node_modules/ol/ol.css";
import CoreModules from "fmtm/CoreModules";
// import { useLocation, useNavigate } from 'react-router-dom';
import Avatar from "../assets/images/avatar.png";
import environment from "fmtm/environment";
import {
  ProjectBuildingGeojsonService,
  ProjectSubmissionService,
} from "../api/SubmissionService";
import TasksMap from "../components/TasksMap/TasksMap";

// import { useDispatch } from 'react-redux';
const Tasks = () => {
  const dispatch = CoreModules.useDispatch();

  const projectSubmissionState = CoreModules.useSelector(
    (state) => state.project.projectSubmission
  );
  const projectState = CoreModules.useSelector(
    (state) => state.project.project
  );
  const projectTaskBoundries = CoreModules.useSelector(
    (state) => state.project.projectTaskBoundries
  );
  const projectBuildingGeojson = CoreModules.useSelector(
    (state) => state.project.projectBuildingGeojson
  );
  const params = CoreModules.useParams();
  const encodedId = params.id;
  const decodedId = environment.decode(encodedId);
  // const theme = CoreModules.useSelector(state => state.theme.hotTheme)
  useEffect(() => {
    dispatch(
      ProjectSubmissionService(
        `${environment.baseApiUrl}/tasks/?project_id=${decodedId}`
      )
    );
    dispatch(
      ProjectBuildingGeojsonService(
        `${environment.baseApiUrl}/projects/${decodedId}/features`
      )
    );
    //creating a manual thunk that will make an API call then autamatically perform state mutation whenever we navigate to home page
  }, []);
  return (
    <CoreModules.Box sx={{ px: 25, py: 6 }}>
      <CoreModules.Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "calc(100vh - 190px)",
        }}
      >
        <CoreModules.Stack
          sx={{ display: "flex", flexDirection: "column", width: "51%" }}
        >
          <CoreModules.Stack
            sx={{ display: "flex", flexDirection: "row", gap: 1 }}
          >
            {/* Project Details SideBar Button for Creating Project */}
            <CoreModules.Button variant="contained" color="error">
              Monitoring
            </CoreModules.Button>

            {/* END */}

            {/* Upload Area SideBar Button for uploading Area page  */}
            <CoreModules.Button variant="contained" color="error">
              Convert
            </CoreModules.Button>
            <a
              href={`${environment.baseApiUrl}/tasks/download?project_id=${decodedId}`}
              download
            >
              <CoreModules.Button variant="contained" color="error">
                Download CSV
              </CoreModules.Button>
            </a>
            {/* END */}
          </CoreModules.Stack>
          <CoreModules.Box
            component="h4"
            sx={{
              background: "#e1e1e1",
              mt: 5,
              height: "90%",
              p: 5,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              overflowY: "scroll",
            }}
          >
            {projectSubmissionState?.map((submission) => {
              const date = new Date(submission.createdAt);

              const dateOptions = {
                minute: "numeric",
                hour: "numeric",
                day: "numeric",
                weekday: "long",
                year: "numeric",
                month: "long",
              };

              const formattedDate = date.toLocaleDateString(
                "en-US",
                dateOptions
              );
              return (
                <CoreModules.Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    background: "white",
                    borderRadius: "10px",
                  }}
                >
                  <CoreModules.Box>
                    <img
                      src={Avatar}
                      style={{ marginRight: "10px", marginLeft: "5px" }}
                    />{" "}
                  </CoreModules.Box>
                  <CoreModules.Box>
                    <CoreModules.Typography
                      variant="subtitle1"
                      noWrap
                      mt={"2%"}
                      ml={"3%"}
                    >
                      {submission.submitted_by}
                    </CoreModules.Typography>
                    <CoreModules.Typography
                      variant="subtitle3"
                      sx={{ color: "gray" }}
                      mt={"2%"}
                      ml={"3%"}
                    >
                      Submitted {projectState?.project} at {formattedDate}
                    </CoreModules.Typography>
                  </CoreModules.Box>
                </CoreModules.Box>
              );
            })}
          </CoreModules.Box>
        </CoreModules.Stack>
        <CoreModules.Box
          sx={{ width: "100%", ml: 6, border: "1px solid green" }}
        >
          {projectTaskBoundries && projectBuildingGeojson && (
            <TasksMap
              projectBuildingGeojson={projectBuildingGeojson}
              projectTaskBoundries={projectTaskBoundries}
            />
          )}
        </CoreModules.Box>
      </CoreModules.Stack>
    </CoreModules.Box>
  );
};

export default Tasks;

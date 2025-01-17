import React, { useEffect } from "react";
import windowDimention from "../../hooks/WindowDimension";
import CoreModules from "../../shared/CoreModules";
import { useNavigate } from 'react-router-dom';
import useForm from "../../hooks/useForm";
import CreateProjectValidation from "./validation/CreateProjectValidation";
import { CreateProjectActions } from '../../store/slices/CreateProjectSlice';
// import { SelectPicker } from 'rsuite';
import { OrganisationService } from "../../api/CreateProjectService";
import environment from "../../environment";
import { InputLabel, MenuItem, Select } from "@mui/material";


const ProjectDetailsForm: React.FC = () => {
    const defaultTheme: any = CoreModules.useSelector<any>(state => state.theme.hotTheme)
    // // const state:any = useSelector<any>(state=>state.project.projectData)
    // // console.log('state main :',state)

    // const { type } = windowDimention();
    // //get window dimension
    const navigate = useNavigate();

    const dispatch = CoreModules.useDispatch()
    // //dispatch function to perform redux state mutation

    const projectDetails: any = CoreModules.useSelector<any>((state) => state.createproject.projectDetails);
    // //we use use selector from redux to get all state of projectDetails from createProject slice

    const organizationListData: any = CoreModules.useSelector<any>((state) => state.createproject.organizationList);
    // //we use use selector from redux to get all state of projectDetails from createProject slice

    const projectDetailsResponse: any = CoreModules.useSelector<any>((state) => state.createproject.projectDetailsResponse);
    // //we use use selector from redux to get all state of projectDetailsResponse from createProject slice

    useEffect(() => {
        dispatch(OrganisationService(`${environment.baseApiUrl}/projects/organization/`))
    }, [])

    useEffect(() => {
        if (projectDetailsResponse !== null) {
            navigate('/select-form');
        }

    }, [projectDetailsResponse])

    const submission = () => {
        // eslint-disable-next-line no-use-before-define
        // submitForm();
        dispatch(CreateProjectActions.SetIndividualProjectDetailsData(values));
        navigate("/select-form", { replace: true, state: { values: values } });


    };

    const { handleSubmit, handleCustomChange, values, errors }: any = useForm(
        projectDetails,
        submission,
        CreateProjectValidation,
    );
    const inputFormStyles = () => {
        return {
            style: {
                color: defaultTheme.palette.error.main,
                fontFamily: defaultTheme.typography.fontFamily,
                fontSize: defaultTheme.typography.fontSize
            } // or className: 'your-class'
        }
    }
    // Changed OrganizationList Data into the Picker Component Format i.e label and value
    const organizationList = organizationListData.map(
        item => ({ label: item.name, value: item.id })
    );
    return (
        <CoreModules.Stack sx={{ width: '50%' }}>
            <form onSubmit={handleSubmit}>
                <CoreModules.FormGroup>
                    {/* Organization Dropdown For Create Project */}

                    <CoreModules.FormControl sx={{ mb: 0, width: '30%', }} variant="filled">
                        <CoreModules.Box sx={{
                            display: 'flex', flexDirection: 'row', pt: 0,
                        }}><CoreModules.FormLabel component="h3" sx={{
                            '&.Mui-focused': {
                                color: 'black',
                            },
                        }}>Organization</CoreModules.FormLabel><CoreModules.FormLabel component="h3" sx={{ color: 'red' }}>*</CoreModules.FormLabel></CoreModules.Box>
                        {/* <InputLabel id="demo-simple-select-label">Organization</InputLabel> */}
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={values.organization}
                            label="Organization"
                            onChange={(e) => {
                                handleCustomChange('organization', e.target.value);
                                dispatch(CreateProjectActions.SetProjectDetails({ key: 'organization', value: e.target.value }))
                            }}
                        >
                            {organizationList?.map((org) => <MenuItem value={org.value}>{org.label}</MenuItem>)}
                        </Select>
                        {errors.organization && <CoreModules.FormLabel component="h3" sx={{ color: defaultTheme.palette.error.main }}>{errors.organization}</CoreModules.FormLabel>}
                    </CoreModules.FormControl>
                    {/* END */}

                    {/* Project Name Form Input For Create Project */}
                    <CoreModules.FormControl sx={{ mb: 0, width: '50%', }}>
                        <CoreModules.Box sx={{ display: 'flex', flexDirection: 'row', pt: 0 }}><CoreModules.FormLabel component="h3">Central ODK Url</CoreModules.FormLabel><CoreModules.FormLabel component="h3" sx={{ color: 'red' }}>*</CoreModules.FormLabel></CoreModules.Box>
                        <CoreModules.TextField
                            id="odk_central_url"
                            label=""
                            variant="filled"
                            inputProps={{ sx: { padding: '8.5px 14px' } }}
                            value={values.odk_central_url}
                            onChange={(e) => {
                                handleCustomChange('odk_central_url', e.target.value);
                            }}
                            helperText={errors.odk_central_url}
                            FormHelperTextProps={inputFormStyles()}

                        />
                        {/* <CoreModules.FormLabel component="h3" sx={{ display:'flex'}}>{errors.name} <CoreModules.FormLabel component="h4" sx={{color:'red'}}>*</CoreModules.FormLabel></CoreModules.FormLabel> */}
                    </CoreModules.FormControl>
                    {/* END */}

                    {/* Project Name Form Input For Create Project */}
                    <CoreModules.FormControl sx={{ mb: 1, width: '50%', }}>
                        <CoreModules.Box sx={{ display: 'flex', flexDirection: 'row' }}><CoreModules.FormLabel sx={{}} component="h3">Central ODK Email/Username</CoreModules.FormLabel><CoreModules.FormLabel component="h3" sx={{ color: 'red' }}>*</CoreModules.FormLabel></CoreModules.Box>
                        <CoreModules.TextField
                            id="odk_central_name"
                            name="odk"
                            label=""
                            variant="filled"
                            inputProps={{ sx: { padding: '8.5px 14px' } }}
                            value={values.odk_central_user}
                            onChange={(e) => {
                                handleCustomChange('odk_central_user', e.target.value);
                            }}
                            autoComplete="new-password"
                            helperText={errors.odk_central_user}
                            FormHelperTextProps={inputFormStyles()}

                        />
                        {/* <CoreModules.FormLabel component="h3" sx={{ display:'flex'}}>{errors.name} <CoreModules.FormLabel component="h4" sx={{color:'red'}}>*</CoreModules.FormLabel></CoreModules.FormLabel> */}
                    </CoreModules.FormControl>
                    {/* END */}

                    {/* Project Name Form Input For Create Project */}
                    <CoreModules.FormControl sx={{ mb: 1, width: '50%', }}>
                        <CoreModules.Box sx={{ display: 'flex', flexDirection: 'row' }}><CoreModules.FormLabel component="h3">Central ODK Password </CoreModules.FormLabel><CoreModules.FormLabel component="h3" sx={{ color: 'red' }}>*</CoreModules.FormLabel></CoreModules.Box>
                        <CoreModules.TextField
                            id="odk_central_new_password"
                            label=""
                            variant="filled"
                            inputProps={{ sx: { padding: '8.5px 14px' } }}
                            value={values.odk_central_password}
                            type="password"
                            autoComplete="new-password"
                            onChange={(e) => {
                                handleCustomChange('odk_central_password', e.target.value);
                            }}
                            helperText={errors.odk_central_password}
                            FormHelperTextProps={inputFormStyles()}

                        />
                        {/* <CoreModules.FormLabel component="h3" sx={{ display:'flex'}}>{errors.name} <CoreModules.FormLabel component="h4" sx={{color:'red'}}>*</CoreModules.FormLabel></CoreModules.FormLabel> */}
                    </CoreModules.FormControl>
                    {/* END */}
                    {/* Project Name Form Input For Create Project */}
                    <CoreModules.FormControl sx={{ mb: 3, width: '50%', }}>
                        <CoreModules.Box sx={{ display: 'flex', flexDirection: 'row' }}><CoreModules.FormLabel component="h3">Project Name</CoreModules.FormLabel><CoreModules.FormLabel component="h3" sx={{ color: 'red' }}>*</CoreModules.FormLabel></CoreModules.Box>
                        <CoreModules.TextField
                            id="project_name"
                            label=""
                            variant="filled"
                            inputProps={{ sx: { padding: '8.5px 14px' } }}
                            value={values.name}
                            onChange={(e) => {
                                handleCustomChange('name', e.target.value);
                            }}
                            helperText={errors.name}
                            FormHelperTextProps={inputFormStyles()}

                        />
                        {/* <CoreModules.FormLabel component="h3" sx={{ display:'flex'}}>{errors.name} <CoreModules.FormLabel component="h4" sx={{color:'red'}}>*</CoreModules.FormLabel></CoreModules.FormLabel> */}
                    </CoreModules.FormControl>
                    {/* END */}

                    {/* Short Description Form Input For Create Project */}
                    <CoreModules.FormControl sx={{ mb: 3 }}>
                        <CoreModules.Box sx={{ display: 'flex', flexDirection: 'row' }}><CoreModules.FormLabel component="h3">Short Description</CoreModules.FormLabel><CoreModules.FormLabel component="h3" sx={{ color: 'red' }}>*</CoreModules.FormLabel></CoreModules.Box>
                        <CoreModules.TextField
                            id="short_description"
                            label=""
                            variant="filled"
                            value={values.short_description}
                            onChange={(e) => {
                                handleCustomChange('short_description', e.target.value);
                            }}
                            multiline
                            rows={4}
                            helperText={errors.short_description}
                            FormHelperTextProps={inputFormStyles()}
                        />
                    </CoreModules.FormControl>
                    {/* END */}

                    {/* Description Form Input For Create Project */}
                    <CoreModules.FormControl sx={{ mb: 3 }}>
                        <CoreModules.Box sx={{ display: 'flex', flexDirection: 'row' }}><CoreModules.FormLabel component="h3">Description</CoreModules.FormLabel><CoreModules.FormLabel component="h3" sx={{ color: 'red' }}>*</CoreModules.FormLabel></CoreModules.Box>
                        <CoreModules.TextField
                            id="description"
                            label=""
                            variant="filled"
                            value={values.description}
                            onChange={(e) => { handleCustomChange('description', e.target.value); }}
                            multiline
                            rows={4}
                            helperText={errors.description}
                            FormHelperTextProps={inputFormStyles()}
                        />
                    </CoreModules.FormControl>
                    {/* END */}

                    <CoreModules.Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        {/* Form Submission Button For Create Project */}
                        <CoreModules.Button
                            variant="contained"
                            color="error"
                            sx={{ width: '20%' }}
                            type="submit"
                        >
                            Next
                        </CoreModules.Button>
                        {/* END */}
                    </CoreModules.Box>
                </CoreModules.FormGroup>
            </form>
        </CoreModules.Stack>
    )
};
export default ProjectDetailsForm;

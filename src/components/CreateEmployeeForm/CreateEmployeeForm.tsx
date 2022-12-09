/* eslint-disable react/jsx-props-no-spreading */
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { differenceInYears } from 'date-fns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { STATES_ARRAY } from 'src/data/states';
// import type { StateName, StateAbbreviation } from 'src/data/states';
import { departments } from 'src/data/departments';

// import styles from './CreateEmployeeForm.module.css';

function CreateEmployeeForm() {
  return (
    <>
      <h2>Create Employee</h2>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          startDate: '',
          street: '',
          city: '',
          zipcode: '',
          state: '',
          department: '',
        }}
        validationSchema={Yup.object({
          firstName: Yup.string().required('Required'),
          lastName: Yup.string().required('Required'),
          dateOfBirth: Yup.date()
            .required('Required')
            .test(
              'legal-age-check',
              'You must be over 18 years or older',
              (date) => {
                if (!date) return false;
                const age = differenceInYears(new Date(), date);
                if (age > 18) {
                  return true;
                }
                return false;
              }
            ),
          startDate: Yup.date().required('Required'),
          street: Yup.string().required('Required'),
          city: Yup.string().required('Required'),
          zipcode: Yup.number().required('Required'),
          state: Yup.string().required('Required'),
          department: Yup.string().required('Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          // eslint-disable-next-line no-alert
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }}
      >
        {({
          errors,
          touched,
          values,
          setFieldValue,
          isSubmitting,
          handleChange,
          handleBlur,
        }) => (
          <Form>
            <TextField
              fullWidth
              label="First Name"
              id="firstName"
              name="firstName"
              type="text"
              error={touched.firstName && Boolean(errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <br />
            <br />
            <TextField
              fullWidth
              label="Last Name"
              id="lastName"
              name="lastName"
              type="text"
              error={touched.lastName && Boolean(errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <br />
            <br />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date of Birth"
                onChange={(value: Date | null) => {
                  return setFieldValue('dateOfBirth', value, true);
                }}
                value={values.dateOfBirth}
                inputFormat="dd/MM/yyyy"
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                    helperText={touched.dateOfBirth && errors.dateOfBirth}
                    onBlur={handleBlur}
                    placeholder="mm/dd/yyyy"
                  />
                )}
              />
              <br />
              <br />
              <DatePicker
                label="Start Date"
                onChange={(value: Date | null) => {
                  return setFieldValue('startDate', value, true);
                }}
                value={values.startDate}
                inputFormat="dd/MM/yyyy"
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    error={touched.startDate && Boolean(errors.startDate)}
                    helperText={touched.startDate && errors.startDate}
                    onBlur={handleBlur}
                    placeholder="mm/dd/yyyy"
                  />
                )}
              />
            </LocalizationProvider>
            <br />
            <br />
            <fieldset className="address">
              <br />
              <legend>Address</legend>
              <TextField
                fullWidth
                label="Street"
                id="street"
                name="street"
                type="text"
                error={touched.street && Boolean(errors.street)}
                helperText={touched.street && errors.street}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <br />
              <br />
              <TextField
                fullWidth
                label="City"
                id="city"
                name="city"
                type="text"
                error={touched.city && Boolean(errors.city)}
                helperText={touched.city && errors.city}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <br />
              <br />
              <FormControl fullWidth>
                <InputLabel
                  id="state-label"
                  error={touched.state && Boolean(errors.state)}
                >
                  State
                </InputLabel>
                <Select
                  labelId="state-label"
                  id="state"
                  name="state"
                  value={values.state}
                  label="State"
                  error={touched.state && Boolean(errors.state)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {STATES_ARRAY.map((state) => (
                    <MenuItem
                      key={state.abbreviation}
                      value={state.abbreviation}
                    >
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={touched.state && Boolean(errors.state)}>
                  {touched.state && errors.state}
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <TextField
                fullWidth
                label="Zip Code"
                id="zipcode"
                name="zipcode"
                type="number"
                error={touched.zipcode && Boolean(errors.zipcode)}
                helperText={touched.zipcode && errors.zipcode}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <br />
            </fieldset>
            <br />
            <FormControl fullWidth>
              <InputLabel
                id="department-label"
                error={touched.department && Boolean(errors.department)}
              >
                Department
              </InputLabel>
              <Select
                labelId="department-label"
                id="department"
                name="department"
                value={values.department}
                label="Department"
                error={touched.department && Boolean(errors.department)}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {departments.map((department) => (
                  <MenuItem key={department} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText
                error={touched.department && Boolean(errors.department)}
              >
                {touched.department && errors.department}
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              type="submit"
            >
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default CreateEmployeeForm;

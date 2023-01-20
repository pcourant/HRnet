import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { differenceInYears } from 'date-fns';
import { Modal } from 'react-modal-simple-customizable';

import { Department, StateAbbreviation, STATES, DEPARTMENTS } from '@types';
import { useCreateEmployee } from '@services';

import styles from './Modal.module.css';

/**
 * Component for creating a new employee via a validated form
 * Libraries:
 *  - 'Formik' for building
 *  - 'Yup' for validation
 *  - 'Material UI' for design, select and date-picker
 *  - 'react-modal-simple-customizable' for showing server response of creation in a modal
 * @component
 * @returns Form to create new employee, send it to the server for saving and display the server response
 */
function CreateEmployeeForm() {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const onClickViewCurrentEmployees = useCallback(
    () => navigate('/employee-list', { replace: true }),
    [navigate]
  );

  const onErrorHandler = useCallback((err: unknown) => {
    setShowModal(true);
    if (axios.isAxiosError(err)) {
      if (err?.response?.data?.error) setError(err?.response?.data?.error);
      else if (err?.message) setError(err?.message);
    } else if (err instanceof Error) {
      setError(err?.message);
    } else {
      setError('Unknown error, look in the devTool console');
    }
  }, []);
  const onSuccessHandler = () => setShowModal(true);
  const createEmployee = useCreateEmployee(onSuccessHandler, onErrorHandler);

  return (
    <>
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
            .typeError('Invalid date, must be : dd/mm/yyyy')
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
          startDate: Yup.date()
            .typeError('Invalid date, must be : dd/mm/yyyy')
            .required('Required'),
          street: Yup.string().required('Required'),
          city: Yup.string().required('Required'),
          zipcode: Yup.number().required('Required'),
          state: Yup.string().required('Required'),
          department: Yup.string().required('Required'),
        })}
        onSubmit={(values) => {
          createEmployee.mutate({
            firstName: values.firstName,
            lastName: values.lastName,
            dateOfBirth: new Date(values.dateOfBirth),
            startDate: new Date(values.startDate),
            street: values.street,
            city: values.city,
            zipcode: +values.zipcode,
            state: values.state as StateAbbreviation,
            department: values.department as Department,
          });
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
            <>
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
                      // eslint-disable-next-line react/jsx-props-no-spreading
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
                      // eslint-disable-next-line react/jsx-props-no-spreading
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
                    {Object.entries(STATES).map(([abbr, name]) => (
                      <MenuItem key={abbr} value={abbr}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText
                    error={touched.state && Boolean(errors.state)}
                  >
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
                  {Object.values(DEPARTMENTS).map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
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
                disabled={isSubmitting && createEmployee.isLoading}
                type="submit"
              >
                Save
              </Button>
            </>
          </Form>
        )}
      </Formik>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalBody}>
          {createEmployee.isError && (
            <>
              <p className={styles.firstLine}>Error!</p>
              <p className={styles.lastLine}>{error}</p>
            </>
          )}
          {createEmployee.isSuccess && <p>Employee created!</p>}
        </div>
        <div className={styles.modalFooter}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="button"
            onClick={() => setShowModal(false)}
          >
            {createEmployee.isSuccess ? 'Create another employee' : 'Try again'}
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="button"
            onClick={onClickViewCurrentEmployees}
          >
            View current employees
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default CreateEmployeeForm;

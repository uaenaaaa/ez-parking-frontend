import type { Actions } from '@sveltejs/kit';
import { API_AUTH_CREATE_ACCOUNT, API_USER_AUTH_ROOT } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { validateEmail } from '$lib/utils/function/validators/validate-email';
import { email } from '$lib/state/account-email-registration-data';
import { validatePlateNumber } from '$lib/utils/function/validators/validate-plate-number';
import axiosInstance from '$lib/utils/function/validators/axios-config';
import { isAxiosError } from 'axios';

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        try {
            const firstName = String(data.get('first-name'));
            const lastName = String(data.get('last-name'));
            const middleName = data.get('middle-name') ? String(data.get('middle-name')) : '';
            const nickname = data.get('nickname') ? String(data.get('nickname')) : '';
            const plateNumber = String(data.get('plate-number'));
            const phone = String(data.get('phone'));
            const userEmail = String(data.get('email'));
            if (!validateEmail(userEmail)) {
                return fail(400, { success: false, message: 'Invalid email' });
            }
            if (!firstName || !lastName || !phone || !plateNumber) {
                return fail(400, { success: false, message: 'Missing required fields' });
            }
            if (firstName.length < 2 || lastName.length < 2) {
                return fail(400, {
                    success: false,
                    message: 'First and Last Name must be at least 2 characters long'
                });
            }
            if (!validatePlateNumber(plateNumber)) {
                return fail(400, { success: false, message: 'Invalid plate number' });
            }

            const response = axiosInstance.post(`${API_USER_AUTH_ROOT}${API_AUTH_CREATE_ACCOUNT}`, {
                user: {
                    email: userEmail,
                    first_name: firstName,
                    last_name: lastName,
                    middle_name: middleName,
                    phone_number: phone as string,
                    plate_number: plateNumber,
                    nickname: nickname
                }
            });
            email.set(data.get('email') as string);
            return (await response).data;
        } catch (error) {
            if (isAxiosError(error)) {
                return fail(error.response?.status || 500, {
                    success: false,
                    message: error.response?.data?.message || 'An error occurred'
                });
            }
            return fail(500, { success: false, message: 'An unexpected error occurred' });
        }
    }
};

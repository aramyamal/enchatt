import axios from "axios";
import MockAdapter from 'axios-mock-adapter';
import { getMultipleChats } from "../api";

const mock = new MockAdapter(axios);

describe('Api mock', () => {
    afterEach(() => {
        mock.reset();
    });

    it('Should throw an error if Array in to getMultipleChat is empty', async() =>{
        await expect(getMultipleChats([])).rejects.toThrowError('Request failed with status code 404');
    });
});

import React, {Fragment, useEffect, useState} from 'react';
import './Authorize.css';
import {allowApp, getAllowedApp, getAppInfo} from "../reducers/actions";
import {useStateValue} from "../reducers/state";

function Authorize() {
    const setRedirectUrl = (url) => {
        console.log(url);
        if (isValidRedirectURI(url)) {
            const result = new URL(url);
            result.hash = '';

            return result;
        }

        return null;
    };

    const isValidRedirectURI = (redirectUrl) => {
        // todo check is not equal current page and other cases
        // todo compare with allowed urls in blockchain

        try {
            if (typeof redirectUrl === 'string') {
                redirectUrl = new URL(redirectUrl);
            }

            console.log(redirectUrl);
            if (redirectUrl && redirectUrl.protocol === 'https:') {
            } else {
                throw new Error();
            }
        } catch {
            return false;
        }

        return true;
    };

    const isValidResponseType = (responseType) => {
        return responseType === 'id_token';
    };

    const {state: {authorizeApp}} = useStateValue();
    const params = new URLSearchParams(window.location.search);
    console.log(params);
    const clientId = params.get('client_id');
    /**
     *
     * @type {URL | null}
     */
    const redirectUri = setRedirectUrl(params.get('redirect_uri'));
    const responseType = params.get('response_type');

    const successReturn = (accessToken, usernameHash) => {
        window.location.replace(`${redirectUri.toString()}#access_token=${accessToken}&user_id=${usernameHash}`);
    };

    const randomText = count => {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < count; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };

    const createRandomAccessToken = () => {
        return randomText(64);
    };

    useEffect(_ => {
        getAppInfo(clientId).then();
        getAllowedApp(clientId)
            .then(accessToken => {
                if (accessToken) {
                    successReturn(accessToken, 'some_username_hash');
                }
            });
    }, [clientId]);

    const onDecline = () => {
        window.location.replace(redirectUri.toString() + '#error=access_denied&error_reason=user_denied&error_description=User denied your request');
    };

    const onAllow = async () => {
        // todo get real username hash
        const usernameHash = 'usernameHash_sge4g34g34g34';
        let accessToken = await getAllowedApp(clientId);

        if (accessToken) {
            successReturn(accessToken, usernameHash);
        } else {
            // todo move token creation to allowApp method
            accessToken = createRandomAccessToken();
            await allowApp(clientId, accessToken);
            successReturn(accessToken, usernameHash);
        }
    };

    const onBack = () => {
        window.history.back();
    };

    const isRedirectUri = isValidRedirectURI(redirectUri);
    const isResponseType = isValidResponseType(responseType);
    const isValidParams = isRedirectUri && isResponseType;
    return <div className="Authorize">
        <h3 className="text-center">Authorization</h3>

        <div className="Authorize-info mx-auto col-sm-4">
            {authorizeApp.errorMessage && <div className="text-center">
                <p>Error on retrieving app info: {authorizeApp.errorMessage}</p>
                <button className="btn btn-primary" onClick={onBack}>Back</button>
            </div>}

            {!authorizeApp.inProcess && !authorizeApp.errorMessage && <Fragment>
                <p>ID: {authorizeApp.id}</p>
                <p>Title: {authorizeApp.title}</p>
                <p>Description: {authorizeApp.description}</p>
                <p>Redirect URL not checked</p>

                {isValidParams && <Fragment>
                    <button className="btn btn-success" onClick={onAllow} disabled={!isValidParams}>Allow
                    </button>
                    <button className="btn btn-danger float-right" onClick={onDecline}
                            disabled={!isValidParams}>Decline
                    </button>
                </Fragment>}

                {!isValidParams && <Fragment>
                    {!isRedirectUri &&
                    <p className="text-danger">Application passed incorrect redirect_uri.</p>}

                    {!isResponseType &&
                    <p className="text-danger">Application passed incorrect response_type. Accepted only id_token. </p>}

                    <p>You can go back to the application.</p>

                    <button className="btn btn-primary" onClick={onBack}>Back</button>
                </Fragment>}
            </Fragment>}
        </div>

        {authorizeApp.inProcess && <div className="App-loading text-center">
            <div className="spinner-border text-success" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>}
    </div>;
}

export default Authorize;
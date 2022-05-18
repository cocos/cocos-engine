/*
 * Copyright 2017 Facebook, Inc.
 * Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Uri class is based on the original file here https://github.com/facebook/folly/blob/master/folly/Uri.cpp
 */

#pragma once

#include <stdint.h>
#include "base/Macros.h"
#include "base/std/container/string.h"
#include "base/std/container/vector.h"

/**
  * @addtogroup network
  * @{
  */

namespace cc {

namespace network {

/**
 * Class representing a URI.
 *
 * Consider http://www.facebook.com/foo/bar?key=foo#anchor
 *
 * The URI is broken down into its parts: scheme ("http"), authority
 * (ie. host and port, in most cases: "www.facebook.com"), path
 * ("/foo/bar"), query ("key=foo") and fragment ("anchor").  The scheme is
 * lower-cased.
 *
 * If this Uri represents a URL, note that, to prevent ambiguity, the component
 * parts are NOT percent-decoded; you should do this yourself with
 * uriUnescape() (for the authority and path) and uriUnescape(...,
 * UriEscapeMode::QUERY) (for the query, but probably only after splitting at
 * '&' to identify the individual parameters).
 */
class CC_DLL Uri {
public:
    /**
     * Parse a Uri from a string.  Throws std::invalid_argument on parse error.
     */
    static Uri parse(const ccstd::string &str);

    /** Default constructor */
    Uri();

    /** Copy constructor */
    Uri(const Uri &o);

    /** Move constructor */
    Uri(Uri &&o);

    /** Copy assignment */
    Uri &operator=(const Uri &o);

    /** Move assignment */
    Uri &operator=(Uri &&o);

    /** Checks whether two Uri instances contain the same values */
    bool operator==(const Uri &o) const;

    /** Checks wether it's a valid URI */
    bool isValid() const { return _isValid; }

    /** Checks whether it's a SSL connection */
    bool isSecure() const { return _isSecure; }

    /** Gets the scheme name for this URI. */
    const ccstd::string &getScheme() const { return _scheme; }

    /** Gets the user name with the specified URI. */
    const ccstd::string &getUserName() const { return _username; }

    /** Gets the password with the specified URI. */
    const ccstd::string &getPassword() const { return _password; }
    /**
     * Get host part of URI. If host is an IPv6 address, square brackets will be
     * returned, for example: "[::1]".
     */
    const ccstd::string &getHost() const { return _host; }
    /**
     * Get host part of URI. If host is an IPv6 address, square brackets will not
     * be returned, for exmaple "::1"; otherwise it returns the same thing as
     * getHost().
     *
     * getHostName() is what one needs to call if passing the host to any other tool
     * or API that connects to that host/port; e.g. getaddrinfo() only understands
     * IPv6 host without square brackets
     */
    const ccstd::string &getHostName() const { return _hostName; }

    /** Gets the port number of the URI. */
    uint16_t getPort() const { return _port; }

    /** Gets the path part of the URI. */
    const ccstd::string &getPath() const { return _path; }

    /// Gets the path, query and fragment parts of the URI.
    const ccstd::string &getPathEtc() const { return _pathEtc; }

    /** Gets the query part of the URI. */
    const ccstd::string &getQuery() const { return _query; }

    /** Gets the fragment part of the URI */
    const ccstd::string &getFragment() const { return _fragment; }

    /** Gets the authority part (userName, password, host and port) of the URI.
     * @note If the port number is a well-known port
     *      number for the given scheme (e.g., 80 for http), it
     *      is not included in the authority.
     */
    const ccstd::string &getAuthority() const { return _authority; }

    /** Gets a string representation of the URI. */
    ccstd::string toString() const;

    /**
    * Get query parameters as key-value pairs.
    * e.g. for URI containing query string:  key1=foo&key2=&key3&=bar&=bar=
    * In returned list, there are 3 entries:
    *     "key1" => "foo"
    *     "key2" => ""
    *     "key3" => ""
    * Parts "=bar" and "=bar=" are ignored, as they are not valid query
    * parameters. "=bar" is missing parameter name, while "=bar=" has more than
    * one equal signs, we don't know which one is the delimiter for key and
    * value.
    *
    * Note, this method is not thread safe, it might update internal state, but
    * only the first call to this method update the state. After the first call
    * is finished, subsequent calls to this method are thread safe.
    *
    * @return  query parameter key-value pairs in a vector, each element is a
    *          pair of which the first element is parameter name and the second
    *          one is parameter value
    */
    const ccstd::vector<std::pair<ccstd::string, ccstd::string>> &getQueryParams();

    /** Clears all parts of the URI. */
    void clear();

private:
    bool doParse(const ccstd::string &str);

    bool _isValid;
    bool _isSecure;
    ccstd::string _scheme;
    ccstd::string _username;
    ccstd::string _password;
    ccstd::string _host;
    ccstd::string _hostName;
    bool _hasAuthority;
    uint16_t _port;
    ccstd::string _authority;
    ccstd::string _pathEtc;
    ccstd::string _path;
    ccstd::string _query;
    ccstd::string _fragment;
    ccstd::vector<std::pair<ccstd::string, ccstd::string>> _queryParams;
};

} // namespace network

} // namespace cc

// end group
/// @}

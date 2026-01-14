require "test_helper"

class AuthControllerTest < ActionDispatch::IntegrationTest
  test "login returns success with token for valid credentials" do
    post "/login", params: { username: "admin", password: "admin" }, as: :json

    assert_response :ok
    json_response = JSON.parse(response.body, symbolize_names: true)

    assert_equal "Login successful", json_response[:message]
    assert_equal "mock-secure-token-12345", json_response[:token]
    assert_equal "admin", json_response[:user][:username]
  end

  test "login returns unauthorized for invalid username" do
    post "/login", params: { username: "wronguser", password: "admin" }, as: :json

    assert_response :unauthorized
    json_response = JSON.parse(response.body, symbolize_names: true)

    assert_equal "Invalid credentials", json_response[:error]
  end

  test "login returns unauthorized for invalid password" do
    post "/login", params: { username: "admin", password: "wrongpass" }, as: :json

    assert_response :unauthorized
    json_response = JSON.parse(response.body, symbolize_names: true)

    assert_equal "Invalid credentials", json_response[:error]
  end

  test "login returns unauthorized when both credentials are wrong" do
    post "/login", params: { username: "wronguser", password: "wrongpass" }, as: :json

    assert_response :unauthorized
    json_response = JSON.parse(response.body, symbolize_names: true)

    assert_equal "Invalid credentials", json_response[:error]
  end

  test "login returns unauthorized when username is missing" do
    post "/login", params: { password: "admin" }, as: :json

    assert_response :unauthorized
    json_response = JSON.parse(response.body, symbolize_names: true)

    assert_equal "Invalid credentials", json_response[:error]
  end

  test "login returns unauthorized when password is missing" do
    post "/login", params: { username: "admin" }, as: :json

    assert_response :unauthorized
    json_response = JSON.parse(response.body, symbolize_names: true)

    assert_equal "Invalid credentials", json_response[:error]
  end

  test "login returns unauthorized when both params are missing" do
    post "/login", params: {}, as: :json

    assert_response :unauthorized
    json_response = JSON.parse(response.body, symbolize_names: true)

    assert_equal "Invalid credentials", json_response[:error]
  end

  test "login is case sensitive for username" do
    post "/login", params: { username: "Admin", password: "admin" }, as: :json

    assert_response :unauthorized
    json_response = JSON.parse(response.body, symbolize_names: true)

    assert_equal "Invalid credentials", json_response[:error]
  end

  test "login is case sensitive for password" do
    post "/login", params: { username: "admin", password: "Admin" }, as: :json

    assert_response :unauthorized
    json_response = JSON.parse(response.body, symbolize_names: true)

    assert_equal "Invalid credentials", json_response[:error]
  end

  test "login accepts JSON content type" do
    post "/login",
         params: { username: "admin", password: "admin" }.to_json,
         headers: { "Content-Type" => "application/json" }

    assert_response :ok
    json_response = JSON.parse(response.body, symbolize_names: true)

    assert_equal "Login successful", json_response[:message]
  end

  test "login response includes all required fields on success" do
    post "/login", params: { username: "admin", password: "admin" }, as: :json

    assert_response :ok
    json_response = JSON.parse(response.body, symbolize_names: true)

    assert json_response.key?(:message)
    assert json_response.key?(:token)
    assert json_response.key?(:user)
    assert json_response[:user].key?(:username)
  end
end

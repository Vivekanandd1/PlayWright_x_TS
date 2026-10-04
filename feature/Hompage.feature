@ui @HealthCheck @AutomationPractice
Feature: E-commerce Web Application Health Check

Background: Navigation to the URL
  Given User navigated to home page url

@UrlValidation @smoke
Scenario: User opened browser and navigate to home page url and validate the home page url with user given url
  And  User navigated to home page url
  Then User should be redirected to correct url

 @smoke @regression @pageLayout
Scenario: Home page loads with core layout elements
    Then the store logo, search box, cart summary and "Sign in" link are displayed
    And the main navigation shows "Women", "Dresses" and "T-shirts"

@regression @HeroBanner
Scenario: Home slider displays promotional banners
    Then the home slider is displayed with its promotional slides
    And the "Shop now !" call to action is visible on the active slide
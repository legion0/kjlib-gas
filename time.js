'use strict';

var Time = class {};

Time.kMilisecondsInSecond = 20;
Time.kMilisecondsInSecond = 1000;
Time.kSecondsInMinute = 60;
Time.kMinutesInHour = 60;
Time.kHoursInDay = 24;

Time.kMilisecondsInMinute = Time.kSecondsInMinute * Time.kMilisecondsInSecond;
Time.kMilisecondsInDay = Time.kHoursInDay * Time.kMinutesInHour * Time.kMilisecondsInMinute;

"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");var _stream = require("stream");

var _bufferutils = _interopRequireDefault(require("../../util/bufferutils"));

function generateRandomData(length) {
  const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomData = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomData += characters.charAt(randomIndex);
  }
  return randomData;
}

describe('Utils Functions', function () {
  describe('Buffer to Stream', function () {
    const bodyToBuffer = generateRandomData(100);
    const buffer = Buffer.from(bodyToBuffer, 'utf-8');

    it('Should transform the Buffer in a Readable Stream', function () {
      const bufferStream = _bufferutils.default.bufferToReadableStream(buffer);

      // Assert that the bufferStream is a Readable stream
      expect(bufferStream).toBeInstanceOf(_stream.Readable);
    });

    it('Should, on data end, checks if the Stream are correct', function () {
      const bufferStream = _bufferutils.default.bufferToReadableStream(buffer);

      let data = '';

      bufferStream.on('data', (chunck) => {
        data += chunck.toString('utf-8');
      });

      bufferStream.on('end', () => {
        expect(data).toStrictEqual(bodyToBuffer);
      });
    });
  });

  describe('Async Buffer to Stream', function () {
    const bodyToBuffer = generateRandomData(10000000);
    const buffer = Buffer.from(bodyToBuffer, 'utf-8');

    it('Should await the Buffer convertion and return a instance of readable', async function () {
      const bufferStream = await _bufferutils.default.AsyncBufferToStream(buffer);

      expect(bufferStream).toBeInstanceOf(_stream.Readable);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfc3RyZWFtIiwicmVxdWlyZSIsIl9idWZmZXJ1dGlscyIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJnZW5lcmF0ZVJhbmRvbURhdGEiLCJsZW5ndGgiLCJjaGFyYWN0ZXJzIiwicmFuZG9tRGF0YSIsImkiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImNoYXJBdCIsImRlc2NyaWJlIiwiYm9keVRvQnVmZmVyIiwiYnVmZmVyIiwiQnVmZmVyIiwiZnJvbSIsIml0IiwiYnVmZmVyU3RyZWFtIiwiYnVmZmVyVXRpbHMiLCJidWZmZXJUb1JlYWRhYmxlU3RyZWFtIiwiZXhwZWN0IiwidG9CZUluc3RhbmNlT2YiLCJSZWFkYWJsZSIsImRhdGEiLCJvbiIsImNodW5jayIsInRvU3RyaW5nIiwidG9TdHJpY3RFcXVhbCIsIkFzeW5jQnVmZmVyVG9TdHJlYW0iXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVzdHMvdXRpbC9idWZmZXJVdGlscy50ZXN0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlYWRhYmxlIH0gZnJvbSAnc3RyZWFtJztcblxuaW1wb3J0IGJ1ZmZlclV0aWxzIGZyb20gJy4uLy4uL3V0aWwvYnVmZmVydXRpbHMnO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbURhdGEobGVuZ3RoOiBudW1iZXIpOiBzdHJpbmcge1xuICBjb25zdCBjaGFyYWN0ZXJzID1cbiAgICAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODknO1xuICBsZXQgcmFuZG9tRGF0YSA9ICcnO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyYWN0ZXJzLmxlbmd0aCk7XG4gICAgcmFuZG9tRGF0YSArPSBjaGFyYWN0ZXJzLmNoYXJBdChyYW5kb21JbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJhbmRvbURhdGE7XG59XG5cbmRlc2NyaWJlKCdVdGlscyBGdW5jdGlvbnMnLCBmdW5jdGlvbiAoKSB7XG4gIGRlc2NyaWJlKCdCdWZmZXIgdG8gU3RyZWFtJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGJvZHlUb0J1ZmZlciA9IGdlbmVyYXRlUmFuZG9tRGF0YSgxMDApO1xuICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGJvZHlUb0J1ZmZlciwgJ3V0Zi04Jyk7XG5cbiAgICBpdCgnU2hvdWxkIHRyYW5zZm9ybSB0aGUgQnVmZmVyIGluIGEgUmVhZGFibGUgU3RyZWFtJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgYnVmZmVyU3RyZWFtID0gYnVmZmVyVXRpbHMuYnVmZmVyVG9SZWFkYWJsZVN0cmVhbShidWZmZXIpO1xuXG4gICAgICAvLyBBc3NlcnQgdGhhdCB0aGUgYnVmZmVyU3RyZWFtIGlzIGEgUmVhZGFibGUgc3RyZWFtXG4gICAgICBleHBlY3QoYnVmZmVyU3RyZWFtKS50b0JlSW5zdGFuY2VPZihSZWFkYWJsZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnU2hvdWxkLCBvbiBkYXRhIGVuZCwgY2hlY2tzIGlmIHRoZSBTdHJlYW0gYXJlIGNvcnJlY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBidWZmZXJTdHJlYW0gPSBidWZmZXJVdGlscy5idWZmZXJUb1JlYWRhYmxlU3RyZWFtKGJ1ZmZlcik7XG5cbiAgICAgIGxldCBkYXRhID0gJyc7XG5cbiAgICAgIGJ1ZmZlclN0cmVhbS5vbignZGF0YScsIChjaHVuY2spID0+IHtcbiAgICAgICAgZGF0YSArPSBjaHVuY2sudG9TdHJpbmcoJ3V0Zi04Jyk7XG4gICAgICB9KTtcblxuICAgICAgYnVmZmVyU3RyZWFtLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChkYXRhKS50b1N0cmljdEVxdWFsKGJvZHlUb0J1ZmZlcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0FzeW5jIEJ1ZmZlciB0byBTdHJlYW0nLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYm9keVRvQnVmZmVyID0gZ2VuZXJhdGVSYW5kb21EYXRhKDEwMDAwMDAwKTtcbiAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbShib2R5VG9CdWZmZXIsICd1dGYtOCcpO1xuXG4gICAgaXQoJ1Nob3VsZCBhd2FpdCB0aGUgQnVmZmVyIGNvbnZlcnRpb24gYW5kIHJldHVybiBhIGluc3RhbmNlIG9mIHJlYWRhYmxlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgYnVmZmVyU3RyZWFtID0gYXdhaXQgYnVmZmVyVXRpbHMuQXN5bmNCdWZmZXJUb1N0cmVhbShidWZmZXIpO1xuXG4gICAgICBleHBlY3QoYnVmZmVyU3RyZWFtKS50b0JlSW5zdGFuY2VPZihSZWFkYWJsZSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXSwibWFwcGluZ3MiOiJrR0FBQSxJQUFBQSxPQUFBLEdBQUFDLE9BQUE7O0FBRUEsSUFBQUMsWUFBQSxHQUFBQyxzQkFBQSxDQUFBRixPQUFBOztBQUVBLFNBQVNHLGtCQUFrQkEsQ0FBQ0MsTUFBYyxFQUFVO0VBQ2xELE1BQU1DLFVBQVU7RUFDZCxnRUFBZ0U7RUFDbEUsSUFBSUMsVUFBVSxHQUFHLEVBQUU7RUFDbkIsS0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdILE1BQU0sRUFBRUcsQ0FBQyxFQUFFLEVBQUU7SUFDL0IsTUFBTUMsV0FBVyxHQUFHQyxJQUFJLENBQUNDLEtBQUssQ0FBQ0QsSUFBSSxDQUFDRSxNQUFNLENBQUMsQ0FBQyxHQUFHTixVQUFVLENBQUNELE1BQU0sQ0FBQztJQUNqRUUsVUFBVSxJQUFJRCxVQUFVLENBQUNPLE1BQU0sQ0FBQ0osV0FBVyxDQUFDO0VBQzlDO0VBQ0EsT0FBT0YsVUFBVTtBQUNuQjs7QUFFQU8sUUFBUSxDQUFDLGlCQUFpQixFQUFFLFlBQVk7RUFDdENBLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxZQUFZO0lBQ3ZDLE1BQU1DLFlBQVksR0FBR1gsa0JBQWtCLENBQUMsR0FBRyxDQUFDO0lBQzVDLE1BQU1ZLE1BQU0sR0FBR0MsTUFBTSxDQUFDQyxJQUFJLENBQUNILFlBQVksRUFBRSxPQUFPLENBQUM7O0lBRWpESSxFQUFFLENBQUMsa0RBQWtELEVBQUUsWUFBWTtNQUNqRSxNQUFNQyxZQUFZLEdBQUdDLG9CQUFXLENBQUNDLHNCQUFzQixDQUFDTixNQUFNLENBQUM7O01BRS9EO01BQ0FPLE1BQU0sQ0FBQ0gsWUFBWSxDQUFDLENBQUNJLGNBQWMsQ0FBQ0MsZ0JBQVEsQ0FBQztJQUMvQyxDQUFDLENBQUM7O0lBRUZOLEVBQUUsQ0FBQyx1REFBdUQsRUFBRSxZQUFZO01BQ3RFLE1BQU1DLFlBQVksR0FBR0Msb0JBQVcsQ0FBQ0Msc0JBQXNCLENBQUNOLE1BQU0sQ0FBQzs7TUFFL0QsSUFBSVUsSUFBSSxHQUFHLEVBQUU7O01BRWJOLFlBQVksQ0FBQ08sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDQyxNQUFNLEtBQUs7UUFDbENGLElBQUksSUFBSUUsTUFBTSxDQUFDQyxRQUFRLENBQUMsT0FBTyxDQUFDO01BQ2xDLENBQUMsQ0FBQzs7TUFFRlQsWUFBWSxDQUFDTyxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU07UUFDM0JKLE1BQU0sQ0FBQ0csSUFBSSxDQUFDLENBQUNJLGFBQWEsQ0FBQ2YsWUFBWSxDQUFDO01BQzFDLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQztFQUNKLENBQUMsQ0FBQzs7RUFFRkQsUUFBUSxDQUFDLHdCQUF3QixFQUFFLFlBQVk7SUFDN0MsTUFBTUMsWUFBWSxHQUFHWCxrQkFBa0IsQ0FBQyxRQUFRLENBQUM7SUFDakQsTUFBTVksTUFBTSxHQUFHQyxNQUFNLENBQUNDLElBQUksQ0FBQ0gsWUFBWSxFQUFFLE9BQU8sQ0FBQzs7SUFFakRJLEVBQUUsQ0FBQyxzRUFBc0UsRUFBRSxrQkFBa0I7TUFDM0YsTUFBTUMsWUFBWSxHQUFHLE1BQU1DLG9CQUFXLENBQUNVLG1CQUFtQixDQUFDZixNQUFNLENBQUM7O01BRWxFTyxNQUFNLENBQUNILFlBQVksQ0FBQyxDQUFDSSxjQUFjLENBQUNDLGdCQUFRLENBQUM7SUFDL0MsQ0FBQyxDQUFDO0VBQ0osQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDIn0=
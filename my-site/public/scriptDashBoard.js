document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId'); // however you store it
  
    fetch(`/api/user-tests/${userId}`)
      .then(res => res.json())
      .then(tests => {
        const list = document.getElementById('test-list');
        list.innerHTML = '';
        tests.forEach(test => {
          const item = document.createElement('li');
          item.innerHTML = `
            Test ID: ${test.test_id} 
            <button onclick="retryTest('${test.test_id}')">Try Again</button>
          `;
          list.appendChild(item);
        });
      });
  });
  
  function retryTest(testId) {
    // Redirect to test page
    window.location.href = `/test-page.html?testId=${testId}`;
  }
  document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId'); // Or however you store it
  
    fetch(`/api/user-tests/${userId}`)
      .then(res => res.json())
      .then(tests => {
        const list = document.getElementById('test-list');
        list.innerHTML = '';
        tests.forEach(test => {
          const item = document.createElement('li');
          item.innerHTML = `
            Test ID: ${test.test_id}
            <button onclick="retryTest('${test.test_id}')">Try Again</button>
          `;
          list.appendChild(item);
        });
      });
  });
  
  function retryTest(testId) {
    window.location.href = `/test.html?testId=${testId}`;
  }
  
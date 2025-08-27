import { useState } from 'react'
import { Code, Copy, Play, Shield, Key, Globe, CheckCircle, AlertTriangle } from 'lucide-react'

const ApiDocsPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [copiedCode, setCopiedCode] = useState('')

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: Globe },
    { id: 'endpoints', name: 'النقاط النهائية', icon: Code },
    { id: 'examples', name: 'أمثلة', icon: Play },
    { id: 'authentication', name: 'المصادقة', icon: Key },
    { id: 'limits', name: 'الحدود', icon: Shield }
  ]

  const endpoints = [
    {
      method: 'POST',
      path: '/api/video/info',
      description: 'الحصول على معلومات الفيديو',
      params: {
        url: 'string (required) - رابط الفيديو'
      },
      response: `{
  "success": true,
  "data": {
    "id": "dQw4w9WgXcQ",
    "title": "Rick Astley - Never Gonna Give You Up",
    "description": "Official video description...",
    "duration": 213,
    "thumbnail": "https://...",
    "uploader": "RickAstleyVEVO",
    "view_count": 1234567890,
    "upload_date": "2009-10-25",
    "formats": [...]
  }
}`
    },
    {
      method: 'POST',
      path: '/api/video/download',
      description: 'تحميل الفيديو',
      params: {
        url: 'string (required) - رابط الفيديو',
        format: 'string (optional) - تنسيق التحميل',
        quality: 'string (optional) - جودة الفيديو'
      },
      response: `{
  "success": true,
  "data": {
    "download_url": "https://...",
    "filename": "video.mp4",
    "size": 45234567,
    "expires_at": "2025-08-27T14:30:00Z"
  }
}`
    },
    {
      method: 'GET',
      path: '/api/platforms',
      description: 'قائمة المنصات المدعومة',
      params: {},
      response: `{
  "success": true,
  "data": {
    "platforms": [
      {
        "name": "YouTube",
        "key": "youtube",
        "supported_features": ["video", "audio", "subtitles"],
        "max_quality": "4K"
      },
      ...
    ]
  }
}`
    }
  ]

  const codeExamples = {
    javascript: `// استخدام JavaScript/Node.js
const response = await fetch('https://api.vidcatch.pro/api/video/info', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  })
});

const data = await response.json();
console.log(data);`,
    python: `# استخدام Python
import requests

url = "https://api.vidcatch.pro/api/video/info"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
data = {
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result)`,
    curl: `# استخدام cURL
curl -X POST https://api.vidcatch.pro/api/video/info \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }'`,
    php: `<?php
// استخدام PHP
$url = 'https://api.vidcatch.pro/api/video/info';
$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer YOUR_API_KEY'
];
$data = json_encode([
    'url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$result = json_decode($response, true);
curl_close($ch);

print_r($result);
?>`
  }

  const copyToClipboard = (code, type) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(type)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const CodeBlock = ({ code, language, title }) => (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-sm text-gray-300 font-medium">{title}</span>
        <button
          onClick={() => copyToClipboard(code, language)}
          className="flex items-center space-x-2 space-x-reverse text-gray-400 hover:text-white text-sm"
        >
          {copiedCode === language ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>تم النسخ!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>نسخ</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Code className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            VidCatch Pro API
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            API قوي ومرن لتحميل الفيديوهات من أكثر من 50 منصة. 
            سهل الاستخدام مع دعم كامل لجميع اللغات البرمجية الشهيرة.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#get-started" className="btn-primary">
              ابدأ الآن مجاناً
            </a>
            <a href="#examples" className="btn-secondary">
              شاهد الأمثلة
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center border-b border-gray-200 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 space-x-reverse px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">نظرة عامة</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    VidCatch Pro API يوفر لك إمكانية دمج خدمات تحميل الفيديوهات في تطبيقاتك ومواقعك الخاصة. 
                    API مصمم ليكون بسيط وقوي في نفس الوقت، مع دعم كامل لأكثر من 50 منصة.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <h3 className="font-bold text-blue-900 mb-2">🚀 سريع ومستقر</h3>
                      <p className="text-blue-800 text-sm">معالجة فورية مع معدل نجاح 99.8%</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <h3 className="font-bold text-green-900 mb-2">🔒 آمن</h3>
                      <p className="text-green-800 text-sm">مصادقة قوية وحماية للبيانات</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                      <h3 className="font-bold text-purple-900 mb-2">📱 متوافق</h3>
                      <p className="text-purple-800 text-sm">يعمل مع جميع اللغات والمنصات</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">الميزات الرئيسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">دعم أكثر من 50 منصة</span>
                    </li>
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">جودات متعددة حتى 4K</span>
                    </li>
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">استخراج الصوت منفصلاً</span>
                    </li>
                  </ul>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">معالجة سريعة (أقل من 3 ثوان)</span>
                    </li>
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">استخراج الترجمات والبيانات الوصفية</span>
                    </li>
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">دعم كامل للقوائم والقنوات</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Endpoints Tab */}
          {activeTab === 'endpoints' && (
            <div className="space-y-8">
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">النقاط النهائية</h2>
                <p className="text-gray-600 mb-8">
                  جميع النقاط النهائية للAPI مع التوثيق الكامل والأمثلة
                </p>
                
                <div className="space-y-8">
                  {endpoints.map((endpoint, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 space-x-reverse mb-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded ${
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-lg font-mono text-gray-900">{endpoint.path}</code>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{endpoint.description}</p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">المعاملات</h4>
                          <div className="bg-gray-50 rounded p-3">
                            {Object.keys(endpoint.params).length > 0 ? (
                              Object.entries(endpoint.params).map(([key, value], idx) => (
                                <div key={idx} className="mb-2 last:mb-0">
                                  <code className="text-sm text-primary-600">{key}</code>
                                  <span className="text-sm text-gray-600 mr-2">: {value}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">لا توجد معاملات مطلوبة</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">الاستجابة</h4>
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                            <code>{endpoint.response}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Examples Tab */}
          {activeTab === 'examples' && (
            <div className="space-y-8" id="examples">
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">أمثلة البرمجة</h2>
                <p className="text-gray-600 mb-8">
                  أمثلة عملية لاستخدام API بلغات برمجة مختلفة
                </p>
                
                <div className="space-y-6">
                  <CodeBlock 
                    code={codeExamples.javascript}
                    language="javascript"
                    title="JavaScript / Node.js"
                  />
                  
                  <CodeBlock 
                    code={codeExamples.python}
                    language="python"
                    title="Python"
                  />
                  
                  <CodeBlock 
                    code={codeExamples.curl}
                    language="curl"
                    title="cURL"
                  />
                  
                  <CodeBlock 
                    code={codeExamples.php}
                    language="php"
                    title="PHP"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Authentication Tab */}
          {activeTab === 'authentication' && (
            <div className="space-y-8">
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">المصادقة</h2>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <Key className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-blue-900 mb-2">API Key</h3>
                        <p className="text-blue-800 text-sm mb-4">
                          تستخدم جميع طلبات API مفتاح API للمصادقة. يجب إرسال المفتاح في header التفويض.
                        </p>
                        <div className="bg-blue-100 rounded p-3">
                          <code className="text-sm text-blue-900">
                            Authorization: Bearer YOUR_API_KEY
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-gray-50">
                      <h3 className="font-bold text-gray-900 mb-3">🆓 الخطة المجانية</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• 100 طلب في الساعة</li>
                        <li>• دعم جميع المنصات</li>
                        <li>• جودة حتى 720p</li>
                        <li>• دعم فني أساسي</li>
                      </ul>
                      <button className="btn-secondary w-full mt-4">
                        احصل على مفتاح مجاني
                      </button>
                    </div>
                    
                    <div className="card bg-primary-50 border-2 border-primary-200">
                      <h3 className="font-bold text-primary-900 mb-3">⭐ الخطة المدفوعة</h3>
                      <ul className="space-y-2 text-sm text-primary-800">
                        <li>• طلبات غير محدودة</li>
                        <li>• جودة 4K و 8K</li>
                        <li>• استخراج الترجمات</li>
                        <li>• دعم فني متقدم 24/7</li>
                      </ul>
                      <button className="btn-primary w-full mt-4">
                        ابدأ بـ $9.99/شهر
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Limits Tab */}
          {activeTab === 'limits' && (
            <div className="space-y-8">
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">الحدود والقيود</h2>
                
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-yellow-900 mb-2">حدود معدل الطلبات</h3>
                        <p className="text-yellow-800 text-sm">
                          لضمان الاستقرار والأداء العالي، نطبق حدود على عدد الطلبات في الساعة الواحدة.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">الخطة</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">الطلبات/ساعة</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">أقصى حجم</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">الجودة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">مجانية</td>
                          <td className="px-4 py-3 text-sm text-gray-600">100</td>
                          <td className="px-4 py-3 text-sm text-gray-600">500 MB</td>
                          <td className="px-4 py-3 text-sm text-gray-600">720p</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">أساسية</td>
                          <td className="px-4 py-3 text-sm text-gray-600">1,000</td>
                          <td className="px-4 py-3 text-sm text-gray-600">2 GB</td>
                          <td className="px-4 py-3 text-sm text-gray-600">1080p</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">احترافية</td>
                          <td className="px-4 py-3 text-sm text-gray-600">غير محدود</td>
                          <td className="px-4 py-3 text-sm text-gray-600">10 GB</td>
                          <td className="px-4 py-3 text-sm text-gray-600">4K</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-900 mb-2">⚠️ قيود مهمة</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• لا ندعم المحتوى المحمي بحقوق طبع</li>
                        <li>• الفيديوهات الخاصة غير متاحة</li>
                        <li>• بعض المنصات قد تحد من الوصول</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">✅ أفضل الممارسات</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• احفظ مفتاح API بشكل آمن</li>
                        <li>• تعامل مع أخطاء الشبكة بشكل صحيح</li>
                        <li>• استخدم retry logic للطلبات الفاشلة</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="card bg-gradient-to-r from-primary-600 to-purple-600 text-white mt-16" id="get-started">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              جاهز للبدء؟
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              احصل على مفتاح API مجاناً وابدأ في دمج خدمات تحميل الفيديوهات في تطبيقك خلال دقائق
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn bg-white text-primary-600 hover:bg-gray-100">
                احصل على مفتاح مجاني
              </button>
              <button className="btn bg-primary-700 hover:bg-primary-800 text-white border border-white/20">
                تواصل مع فريق المبيعات
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiDocsPage
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function TestPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Testing Card</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>My First Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the card content!</p>
          <p className="text-gray-600 mt-2">Cards help organize information.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Another Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You can have multiple cards!</p>
          <Button variant="primary" className="mt-4">Click Me</Button>
        </CardContent>
      </Card>
    </div>
  );
}